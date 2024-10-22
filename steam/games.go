package steam

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/chenasraf/stimvisor/common"
	"github.com/chenasraf/stimvisor/dirs"
	"github.com/chenasraf/stimvisor/logger"

	"github.com/Goldziher/go-utils/sliceutils"
)

// GameInfo represents the information about a game.
type GameInfo struct {
	Id               string   `json:"id"`
	Name             string   `json:"name"`
	InstallDir       string   `json:"installDir"`
	Description      string   `json:"description"`
	ShortDescription string   `json:"shortDescription"`
	Website          string   `json:"website"`
	BackgroundImage  string   `json:"backgroundImage"`
	CapsuleImage     string   `json:"capsuleImage"`
	Categories       []string `json:"categories"`
}

// GetGameInfo retrieves the information of a game given its ID.
func GetGameInfo(gameId string) (GameInfo, error) {
	gameDir, err := dirs.GetGameDirectory(gameId)
	if err != nil {
		return GameInfo{}, err
	}
	raw, err := loadGameInfo(gameId)
	if err != nil {
		return GameInfo{}, err
	}

	website := ""
	if raw["website"] != nil {
		website = raw["website"].(string)
	}

	categories := []string{}
	if raw["categories"] != nil {
		categories = sliceutils.Map(
			raw["categories"].([]interface{}),
			func(v interface{}, i int, l []interface{}) string {
				val, ok := v.(map[string]interface{})
				if !ok {
					return ""
				}
				return val["description"].(string)
			})
	}

	return GameInfo{
		Id:               gameId,
		Name:             raw["name"].(string),
		InstallDir:       gameDir,
		Description:      raw["detailed_description"].(string),
		ShortDescription: raw["short_description"].(string),
		Website:          website,
		BackgroundImage:  raw["background"].(string),
		CapsuleImage:     raw["capsule_image"].(string),
		Categories:       categories,
	}, nil
}

// GetGameInfoCacheDir returns the directory path for caching game information.
func GetGameInfoCacheDir() string {
	configDir := common.GetConfigDir()
	return filepath.Join(configDir, "cache", "gameinfo")
}

// loadGameInfo loads the game information from the cache or fetches it if not available.
func loadGameInfo(gameId string) (map[string]interface{}, error) {
	info := make(map[string]interface{})
	cachePath := filepath.Join(GetGameInfoCacheDir(), gameId+".json")
	var err error
	if _, err = os.Stat(cachePath); os.IsNotExist(err) {
		info, err = fetchGameInfo(gameId)
		if err == nil {
			return info, nil
		}
	}
	if err != nil {
		return info, err
	}
	f, err := os.ReadFile(cachePath)
	if err != nil {
		return info, err
	}
	json.Unmarshal(f, &info)
	logger.Debug("Loaded game info for %s from cache", gameId)
	return info, nil
}

const STEAM_API_URL = "https://store.steampowered.com/api/appdetails?appids=%s"

// fetchGameInfo fetches the game information from the Steam API and caches it.
func fetchGameInfo(gameId string) (map[string]interface{}, error) {
	os.MkdirAll(GetGameInfoCacheDir(), 0755)
	cachePath := filepath.Join(GetGameInfoCacheDir(), gameId+".json")
	url := fmt.Sprintf(STEAM_API_URL, gameId)
	logger.Info("Fetching game info for %s from %s", gameId, url)
	resp, err := http.Get(url)
	if err != nil {
		logger.FatalErr(err)
		panic(err)
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	respJson := make(map[string]interface{})
	json.Unmarshal(respBytes, &respJson)

	if respJson[gameId] == nil {
		logger.Error("Failed to fetch game info for %s", gameId)
		return map[string]interface{}{}, fmt.Errorf("Failed to fetch game info for %s", gameId)
	}
	// extract result->gameId->data
	respGame := respJson[gameId].(map[string]interface{})

	if respGame["success"] == false || respGame["data"] == nil {
		logger.Error("Failed to fetch game info for %s", gameId)
		return map[string]interface{}{}, fmt.Errorf("Failed to fetch game info for %s", gameId)
	}
	respGameData := respGame["data"].(map[string]interface{})
	partBytes, _ := json.Marshal(respGameData)

	cacheFile, err := os.Create(cachePath)
	if err != nil {
		logger.FatalErr(err)
		panic(err)
	}
	defer cacheFile.Close()

	logger.Info("Caching game info for %s", gameId)
	cacheFile.WriteString(string(partBytes))

	return respGameData, nil
}
