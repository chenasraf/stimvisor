package main

import (
	"context"
	"fmt"
	"path/filepath"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func WrapError(err error) SteamLibraryMeta {
	return SteamLibraryMeta{Error: err.Error()}
}

type SteamLibraryMeta struct {
	Error           string   `json:"error,omitempty"`
	SteamDir        string   `json:"steamDir"`
	UserDir         string   `json:"userDir"`
	GameDirs        []string `json:"gameDirs"`
	ScreenshotsDirs []string `json:"screenshotsDirs"`
	SyncDir         string   `json:"syncDir"`
}

func (a *App) GetSteamLibraryMeta() SteamLibraryMeta {
	p, err := GetSteamDirectory()
	if err != nil {
		return WrapError(err)
	}
	userDir, err := GetSteamUserDirectory()
	if err != nil {
		return WrapError(err)
	}
	fmt.Printf("User Dir: %s\n", userDir)
	userId := filepath.Base(userDir)
	gd, err := GetGameDirectories(userId)
	if err != nil {
		return WrapError(err)
	}
	syncDir, err := GetSyncDirectory()
	if err != nil {
		return WrapError(err)
	}
	screenshotsDirs, err := GetScreenshotsDirs()
	if err != nil {
		return WrapError(err)
	}
	out := SteamLibraryMeta{
		SteamDir:        p,
		GameDirs:        gd,
		UserDir:         userDir,
		SyncDir:         syncDir,
		ScreenshotsDirs: screenshotsDirs,
	}

	return out
}
