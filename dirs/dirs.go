package dirs

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"

	"github.com/chenasraf/stimvisor/common"
	"github.com/chenasraf/stimvisor/logger"
)

// GetSteamDirectory returns the Steam directory path based on the operating system.
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
		return fmt.Sprintf(common.WINDOWS_STEAM_DIR, localAppData), nil
	}

	homedir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("Could not determine the user's home directory")
	}
	format = common.LINUX_STEAM_DIR
	if osname == "darwin" {
		format = common.DARWIN_STEAM_DIR
	}
	return fmt.Sprintf(format, homedir), nil
}

// GetUserId returns the Steam user ID by extracting it from the Steam user directory path.
func GetUserId() (string, error) {
	userDir, err := GetSteamUserDirectory()
	return filepath.Base(userDir), err
}

// GetSteamUserDirectory returns the directory path of the first Steam user found.
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

// GetSyncDirectory returns the directory path for Steam sync data.
func GetSyncDirectory() (string, error) {
	userDir, err := GetSteamUserDirectory()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s/760", userDir), nil
}

// GetUsersDirectories returns a list of directories for all Steam users.
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

// GetUserDirectory returns the directory path for a specific Steam user by user ID.
func GetUserDirectory(userId string) (string, error) {
	steamDir, err := GetSteamDirectory()
	if err != nil {
		return "", err
	}
	logger.Info("Get User Dir: %s/userdata/%s", steamDir, userId)
	return fmt.Sprintf("%s/userdata/%s", steamDir, userId), nil
}
