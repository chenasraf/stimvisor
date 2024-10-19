package screenshots

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/chenasraf/stimvisor/steam"
)

// screenshots: /Users/chen/Library/Application\ Support/Steam/userdata/USER_ID/760/remote/GAME_ID/screenshots
type ScreenshotsDir struct {
	Dir         string   `json:"dir"`
	UserId      string   `json:"userId"`
	GameId      string   `json:"gameId"`
	GameName    string   `json:"gameName"`
	Screenshots []string `json:"screenshots"`
	TotalCount  int      `json:"totalCount"`
}

func NewScreenshotsDirFromPath(path string, limit int) ScreenshotsDir {
	dir, err := os.Open(path)
	if os.IsNotExist(err) {
		return ScreenshotsDir{}
	}
	if err != nil {
		panic(err)
	}
	defer dir.Close()
	s := ScreenshotsDir{}
	s.Dir = path
	s.GameId = filepath.Base(getDir(path, 1))
	s.GameName = steam.GetGameName(s.GameId)
	s.UserId = filepath.Base(getDir(path, 4))

	files, err := dir.Readdir(0)
	if err != nil {
		return s
	}
	s.TotalCount = len(files)
	for i, f := range files {
		if f.IsDir() {
			continue
		}
		if limit > 0 && i >= limit {
			break
		}
		path := fmt.Sprintf("%s/%s", path, f.Name())
		// s.Screenshots = append(s.Screenshots, fmt.Sprintf("%s/%s", path, f.Name()))
		// convert to base64
		// Determine the content type of the image file
		bytes, err := os.ReadFile(path)
		if err != nil {
			panic(err)
		}

		mimeType := http.DetectContentType(bytes)

		// Prepend the appropriate URI scheme header depending
		// on the MIME type
		var b64 string
		switch mimeType {
		case "image/jpeg":
			b64 += "data:image/jpeg;base64,"
		case "image/png":
			b64 += "data:image/png;base64,"
		default:
			continue
		}
		b64 += base64.StdEncoding.EncodeToString(bytes)
		s.Screenshots = append(s.Screenshots, b64)
	}
	return s
}

func getDir(path string, depth int) string {
	for i := 0; i < depth; i++ {
		path = filepath.Dir(path)
	}
	return path
}
