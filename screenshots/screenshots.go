package screenshots

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

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

func NewScreenshotsDirFromPath(path string, limit int) ScreenshotCollection {
	dir, err := os.Open(path)
	if os.IsNotExist(err) {
		logger.Error("Screenshots directory does not exist: ", path)
		return ScreenshotCollection{}
	}
	if err != nil {
		logger.FatalErr(err)
		panic(err)
	}
	defer dir.Close()
	s := ScreenshotCollection{}
	s.Dir = path
	s.GameId = filepath.Base(getDir(path, 1))
	steamdir, err := dirs.GetSteamUserDirectory()
	if err != nil {
		return s
	}
	info, err := steam.GetGameInfo(s.GameId)
	logger.Debug("Screenshots info fetched for %s", s.GameId)
	if err != nil {
		return s
	}
	s.GameName = info.Name
	s.UserId = filepath.Base(getDir(path, 4))

	files, err := dir.Readdir(0)
	if err != nil {
		return s
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
			panic(err)
		}

		mimeType := http.DetectContentType(bytes)

		supportedMimeTypes := []string{"image/jpeg", "image/png"}
		isSupported := strings.Contains(strings.Join(supportedMimeTypes, " "), mimeType)
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
	logger.Info("Found %d screenshots for %s", s.TotalCount, s.GameName)
	return s
}

func getDir(path string, depth int) string {
	for i := 0; i < depth; i++ {
		path = filepath.Dir(path)
	}
	return path
}
