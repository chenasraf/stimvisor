package main

import (
	"fmt"
	"os"
	"runtime"
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

func GetSteamUserdataDirectory() (string, error) {
	steamDir, err := GetSteamDirectory()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s/userdata", steamDir), nil
}

func GetSyncDirectory() (string, error) {
	dataDir, err := GetSteamUserdataDirectory()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s/760", dataDir), nil
}

// screenshots: /Users/chen/Library/Application\ Support/Steam/userdata/37889173/760/remote/1086940/screenshots
func GetGameDirectories() ([]string, error) {
	steamDir, err := GetSteamDirectory()
	if err != nil {
		return nil, err
	}
	steamUserData := fmt.Sprintf("%s/userdata", steamDir)
	entries, err := os.ReadDir(steamUserData)
	if err != nil {
		return nil, err
	}
	var gameDirs []string
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		gameDir := fmt.Sprintf("%s/%s", steamUserData, entry.Name())
		gameDirs = append(gameDirs, gameDir)
	}
	return gameDirs, nil
}
