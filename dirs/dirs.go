package dirs

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"slices"
	"strconv"
)

const (
	DARWIN_STEAM_DIR  = "%s/Library/Application Support/Steam"
	WINDOWS_STEAM_DIR = "%s/Steam"
	LINUX_STEAM_DIR   = "%s/.steam/steam"
)

const (
	SYNC_APP_ID = 760
)

func GetSteamDirectory() (string, error) {
	osname := runtime.GOOS
	var format string
	if osname == "windows" {
		localAppData := os.Getenv("LOCALAPPDATA")
		if localAppData == "" {
			homedir, err := os.UserHomeDir()
			if err != nil {
				return "", fmt.Errorf("Could not determine the user's Steam directory")
			}
			localAppData = fmt.Sprintf("%s/AppData/Local", homedir)
		}
		return fmt.Sprintf(WINDOWS_STEAM_DIR, localAppData), nil
	}

	homedir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("Could not determine the user's home directory")
	}
	format = LINUX_STEAM_DIR
	if osname == "darwin" {
		format = DARWIN_STEAM_DIR
	}
	return fmt.Sprintf(format, homedir), nil
}

func GetUserId() (string, error) {
	userDir, err := GetSteamUserDirectory()
	return filepath.Base(userDir), err
}

func GetSteamUserDirectory() (string, error) {
	userDirs, err := GetUsersDirectories()
	if err != nil {
		return "", err
	}
	if len(userDirs) == 0 {
		return "", fmt.Errorf("Could not find any Steam users")
	}
	// TODO multiple users
	return userDirs[0], nil
}

func GetSyncDirectory() (string, error) {
	userDir, err := GetSteamUserDirectory()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s/760", userDir), nil
}

var STEAM_INTERNAL_IDS = []string{"7", "760"}

func GetUsersDirectories() ([]string, error) {
	steamDir, err := GetSteamDirectory()
	if err != nil {
		return nil, err
	}
	steamUserData := fmt.Sprintf("%s/userdata", steamDir)
	entries, err := os.ReadDir(steamUserData)
	if err != nil {
		return nil, err
	}
	var userDirs []string
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		gameDir := fmt.Sprintf("%s/%s", steamUserData, entry.Name())
		userDirs = append(userDirs, gameDir)
	}
	return userDirs, nil
}

func GetUserDirectory(userId string) (string, error) {
	steamDir, err := GetSteamDirectory()
	if err != nil {
		return "", err
	}
	// fmt.Printf("Get User Dir: %s/userdata/%s\n", steamDir, userId)
	return fmt.Sprintf("%s/userdata/%s", steamDir, userId), nil
}

func GetGameDirectories(userId string) ([]string, error) {
	userDir, err := GetUserDirectory(userId)
	if err != nil {
		return nil, err
	}

	entries, err := os.ReadDir(userDir)
	if err != nil {
		return nil, err
	}

	gameDirs := []string{}
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		if slices.Contains(STEAM_INTERNAL_IDS, entry.Name()) {
			continue
		}
		if _, err := strconv.Atoi(entry.Name()); err != nil {
			continue
		}
		gameDir := fmt.Sprintf("%s/%s", userDir, entry.Name())
		gameDirs = append(gameDirs, gameDir)
	}
	return gameDirs, nil
}

func GetGameDirectory(gameId string) (string, error) {
	userDir, err := GetSteamUserDirectory()
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%s/%s", userDir, gameId), nil
}

func GetScreenshotsDirs() ([]string, error) {
	syncDir, err := GetSyncDirectory()
	if err != nil {
		return nil, err
	}
	var dirs []string
	remoteDir := fmt.Sprintf("%s/remote", syncDir)
	entries, err := os.ReadDir(remoteDir)
	if err != nil {
		return nil, err
	}
	for _, entry := range entries {
		// fmt.Printf("Entry: %s\n", entry.Name())
		if !entry.IsDir() {
			continue
		}
		scrDir := fmt.Sprintf("%s/%s/screenshots", remoteDir, entry.Name())
		// fmt.Printf("Checking: %s\n", scrDir)
		if _, err := os.Stat(scrDir); os.IsNotExist(err) {
			continue
		}
		dirs = append(dirs, scrDir)
	}
	return dirs, nil
}

func GetScreenshotsDir(gameId string) (string, error) {
	syncDir, err := GetSyncDirectory()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s/remote/%s/screenshots", syncDir, gameId), nil
}
