package steam

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/chenasraf/stimvisor/config"
	"github.com/chenasraf/stimvisor/dirs"
)

type GameInfo struct {
	Id         string `json:"id"`
	Name       string `json:"name"`
	InstallDir string `json:"installDir"`
}

func GetGameInfo(gameId string) GameInfo {
	gameDir, err := dirs.GetGameDirectory(gameId)
	if err != nil {
		return GameInfo{}
	}
	gameName := GetGameName(gameId)
	return GameInfo{
		Id:         gameId,
		Name:       gameName,
		InstallDir: gameDir,
	}
}

func GetGameInfoCacheDir() string {
	configDir := config.GetConfigDir()
	return filepath.Join(configDir, ".cache", "gameinfo")
}

func LoadGameInfo(gameId string) (map[string]interface{}, error) {
	os.MkdirAll(GetGameInfoCacheDir(), 0755)
	info := make(map[string]interface{})
	cachePath := filepath.Join(GetGameInfoCacheDir(), gameId+".json")
	var err error
	if _, err = os.Stat(cachePath); os.IsNotExist(err) {
		info, err = FetchGameInfo(gameId)
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
	return info, nil
}

const STEAM_API_URL = "https://store.steampowered.com/api/appdetails?appids=%s"

func FetchGameInfo(gameId string) (map[string]interface{}, error) {
	cachePath := filepath.Join(GetGameInfoCacheDir(), gameId+".json")
	url := fmt.Sprintf(STEAM_API_URL, gameId)
	resp, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	cacheFile, err := os.Create(cachePath)
	if err != nil {
		panic(err)
	}
	defer cacheFile.Close()

	respBytes, err := io.ReadAll(resp.Body)
	respJson := make(map[string]interface{})
	json.Unmarshal(respBytes, &respJson)

	// extract result->gameId->data
	respGame := respJson[gameId].(map[string]interface{})

	if respGame["success"] == false || respGame["data"] == nil {
		return map[string]interface{}{}, fmt.Errorf("Failed to fetch game info for %s", gameId)
	}
	respGameData := respGame["data"].(map[string]interface{})
	partBytes, _ := json.Marshal(respGameData)

	cacheFile.WriteString(string(partBytes))

	return respGameData, nil
}

func GetGameName(gameId string) string {
	os.MkdirAll(GetGameInfoCacheDir(), 0755)
	info := make(map[string]interface{})
	cachePath := filepath.Join(GetGameInfoCacheDir(), gameId+".json")
	if _, err := os.Stat(cachePath); os.IsNotExist(err) {
		info, err = FetchGameInfo(gameId)
		if err != nil {
			return gameId
		}
	} else {
		info, err = LoadGameInfo(gameId)
		if err != nil {
			return gameId
		}
	}
	fmt.Printf("INFO: %v\n", info)
	if info["name"] == nil {
		return gameId
	}
	return info["name"].(string)
}