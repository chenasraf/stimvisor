package main

import (
	"context"
	"fmt"
	"path/filepath"

	"github.com/chenasraf/stimvisor/dirs"
	"github.com/wailsapp/wails/v2/pkg/runtime"
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
	Error           string               `json:"error,omitempty"`
	SteamDir        string               `json:"steamDir"`
	UserDir         string               `json:"userDir"`
	GameDirs        []string             `json:"gameDirs"`
	ScreenshotsDirs []dirs.ScreenshotDir `json:"screenshotsDirs"`
	SyncDir         string               `json:"syncDir"`
}

func (a *App) GetSteamLibraryMeta() SteamLibraryMeta {
	p, err := dirs.GetSteamDirectory()
	if err != nil {
		return WrapError(err)
	}
	userDir, err := dirs.GetSteamUserDirectory()
	if err != nil {
		return WrapError(err)
	}
	// fmt.Printf("User Dir: %s\n", userDir)
	userId := filepath.Base(userDir)
	gd, err := dirs.GetGameDirectories(userId)
	if err != nil {
		return WrapError(err)
	}
	syncDir, err := dirs.GetSyncDirectory()
	if err != nil {
		return WrapError(err)
	}
	screenshotsDirPaths, err := dirs.GetScreenshotsDirs()
	if err != nil {
		return WrapError(err)
	}
	screenshotsDirs := []dirs.ScreenshotDir{}
	for _, path := range screenshotsDirPaths {
		screenshotsDirs = append(screenshotsDirs, dirs.NewScreenshotDirFromPath(path))
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

func (a *App) OnWindowResize() {
	config := GetConfig()

	w, h := runtime.WindowGetSize(a.ctx)
	fmt.Printf("OnWindowResize: %d, %d\n", w, h)
	config.WindowWidth = w
	config.WindowHeight = h

	config.Save()
}
