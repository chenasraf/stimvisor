package screenshots

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"slices"
	"sort"
	"strings"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/chenasraf/stimvisor/common"
	"github.com/chenasraf/stimvisor/dirs"
	"github.com/chenasraf/stimvisor/logger"
	"github.com/chenasraf/stimvisor/steam"
)

type ScreenshotCollection struct {
	Dir         string            `json:"dir"`
	UserId      string            `json:"userId"`
	GameId      string            `json:"gameId"`
	GameName    string            `json:"gameName"`
	Screenshots []ScreenshotEntry `json:"screenshots"`
	TotalCount  int               `json:"totalCount"`
}

type ScreenshotEntry struct {
	Dir      string `json:"dir"`
	Path     string `json:"path"`
	URL      string `json:"url"`
	Name     string `json:"name"`
	MimeType string `json:"mimeType"`
}

func NewScreenshotsDirFromPath(path string, limit int) (ScreenshotCollection, error) {
	limit = 0
	dir, err := os.Open(path)
	if os.IsNotExist(err) {
		logger.Error("Screenshots directory does not exist: ", path)
		return ScreenshotCollection{}, fmt.Errorf("Screenshots directory does not exist: %s", path)
	}
	if err != nil {
		logger.FatalErr(err)
		return ScreenshotCollection{}, err
	}
	defer dir.Close()
	s := ScreenshotCollection{}
	s.Dir = path
	s.GameId = filepath.Base(baseDirCount(path, 1))
	steamdir, err := dirs.GetSteamUserDirectory()
	if err != nil {
		return s, err
	}
	info, err := steam.GetGameInfo(s.GameId)
	logger.Debug("Screenshots info fetched for %s", s.GameId)
	if err != nil {
		return s, err
	}
	s.GameName = info.Name
	s.UserId = filepath.Base(baseDirCount(path, 4))

	files, err := dir.Readdir(0)
	if err != nil {
		return s, err
	}
	for i, f := range files {
		if f.IsDir() {
			logger.Debug("Skipping directory %s", f.Name())
			continue
		}
		path := fmt.Sprintf("%s/%s", path, f.Name())
		bytes, err := os.ReadFile(path)
		if err != nil {
			logger.FatalErr(err)
			return s, err
		}

		mimeType := http.DetectContentType(bytes)

		supportedMimeTypes := []string{"image/jpeg", "image/png"}
		isSupported := sliceutils.Includes(supportedMimeTypes, mimeType)
		if !isSupported {
			logger.Debug("Unsupported mime type %s for %s", mimeType, f.Name())
			continue
		}
		s.TotalCount++
		if limit > 0 && i > limit {
			continue
		}
		url, _ := strings.CutPrefix(path, steamdir)
		url, _ = strings.CutPrefix(url, "/")
		entry := ScreenshotEntry{
			Dir:  filepath.Dir(path),
			Path: path,
			Name: f.Name(),
			// TODO move URL to consts
			URL:      fmt.Sprintf("http://localhost:9876/images/%s", url),
			MimeType: mimeType,
		}

		s.Screenshots = append(s.Screenshots, entry)
	}
	sort.SliceStable(s.Screenshots, func(i, j int) bool {
		return s.Screenshots[i].Name < s.Screenshots[j].Name
	})
	logger.Info("Found %d screenshots for %s", s.TotalCount, s.GameName)
	return s, err
}

func GetScreenshotsRoot() (string, error) {
	syncDir, err := dirs.GetSyncDirectory()
	if err != nil {
		return "", err
	}
	remoteDir := fmt.Sprintf("%s/remote", syncDir)
	return remoteDir, nil
}

// GetAllDirs returns a list of directories for all screenshots of all games.
func GetAllDirs() ([]string, error) {
	rootDir, err := GetScreenshotsRoot()
	var dirs []string
	entries, err := os.ReadDir(rootDir)
	if err != nil {
		return nil, err
	}
	for _, entry := range entries {
		// logger.Debug("Entry: %s", entry.Name())
		if !entry.IsDir() {
			continue
		}
		if slices.Contains(common.STEAM_INTERNAL_IDS, entry.Name()) {
			continue
		}
		scrDir := fmt.Sprintf("%s/%s/screenshots", rootDir, entry.Name())
		logger.Debug("Checking: %s", scrDir)
		if _, err := os.Stat(scrDir); os.IsNotExist(err) {
			continue
		}
		dirs = append(dirs, scrDir)
	}
	return dirs, nil
}

// GetDirForGame returns the directory path for screenshots of a specific game by game ID.
func GetDirForGame(gameId string) (string, error) {
	syncDir, err := dirs.GetSyncDirectory()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s/remote/%s/screenshots", syncDir, gameId), nil
}

type ScreensotAction string

const (
	DeleteScreenshotAction ScreensotAction = "delete"
)

func ManageScreenshot(path string, action ScreensotAction) error {
	switch string(action) {
	case "delete":
		scrDir, err := GetScreenshotsRoot()
		if err != nil {
			return err
		}
		fileIsInScreenshotsDir := strings.HasPrefix(path, scrDir)
		if !fileIsInScreenshotsDir {
			return fmt.Errorf("File is not in screenshots directory")
		}
		logger.Info("Deleting screenshot: %s", path)
		err = os.Remove(path)
		if err != nil {
			return err
		}
	}
	return nil
}

func baseDirCount(path string, depth int) string {
	for i := 0; i < depth; i++ {
		path = filepath.Dir(path)
	}
	return path
}
