package common

import (
	"os"
	"path/filepath"
	"runtime"
)

const (
	DARWIN_STEAM_DIR  = "%s/Library/Application Support/Steam"
	WINDOWS_STEAM_DIR = "%s/Steam"
	LINUX_STEAM_DIR   = "%s/.steam/steam"
)

var STEAM_INTERNAL_IDS = []string{
	"7",      // Steam Config
	"760",    // Steam Cloud - Screenshots
	"241100", // Steam Controller Config
}

func GetConfigDir() string {
	if os.Getenv("XDG_CONFIG_HOME") != "" {
		return filepath.Join(os.Getenv("XDG_CONFIG_HOME"), "stimvisor")
	}
	if runtime.GOOS == "windows" {
		return filepath.Join(os.Getenv("APPDATA"), "stimvisor")
	}
	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	return filepath.Join(home, ".config", "stimvisor")
}

func GetCacheDir() string {
	if os.Getenv("XDG_CACHE_HOME") != "" {
		return filepath.Join(os.Getenv("XDG_CACHE_HOME"), "stimvisor")
	}
	if runtime.GOOS == "windows" {
		return filepath.Join(os.Getenv("LOCALAPPDATA"), "stimvisor")
	}
	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	return filepath.Join(home, ".cache", "stimvisor")
}
