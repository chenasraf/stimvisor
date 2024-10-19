package main

import (
	"context"
	"path/filepath"

	"github.com/chenasraf/stimvisor/config"
	"github.com/chenasraf/stimvisor/dirs"
	"github.com/chenasraf/stimvisor/screenshots"
	"github.com/chenasraf/stimvisor/steam"
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

func SteamLibraryMetaError(err error) SteamLibraryMeta {
	return SteamLibraryMeta{Error: err.Error()}
}

type SteamLibraryMeta struct {
	Error    string   `json:"error,omitempty"`
	SteamDir string   `json:"steamDir"`
	UserDir  string   `json:"userDir"`
	GameDirs []string `json:"gameDirs"`
	SyncDir  string   `json:"syncDir"`
}

func (a *App) GetSteamLibraryMeta() SteamLibraryMeta {
	p, err := dirs.GetSteamDirectory()
	if err != nil {
		return SteamLibraryMetaError(err)
	}
	userDir, err := dirs.GetSteamUserDirectory()
	if err != nil {
		return SteamLibraryMetaError(err)
	}
	// fmt.Printf("User Dir: %s\n", userDir)
	userId := filepath.Base(userDir)
	gd, err := dirs.GetGameDirectories(userId)
	if err != nil {
		return SteamLibraryMetaError(err)
	}
	syncDir, err := dirs.GetSyncDirectory()
	if err != nil {
		return SteamLibraryMetaError(err)
	}
	out := SteamLibraryMeta{
		SteamDir: p,
		GameDirs: gd,
		UserDir:  userDir,
		SyncDir:  syncDir,
	}

	return out
}

type ScreenshotsDirs struct {
	Error           string                       `json:"error,omitempty"`
	ScreenshotsDirs []screenshots.ScreenshotsDir `json:"screenshotsDirs"`
}

func ScreenshotsDirsError(err error) ScreenshotsDirs {
	return ScreenshotsDirs{Error: err.Error()}
}

const SHORT_SCREENSHOTS_LIMIT = 5

func (a *App) GetScreenshots() ScreenshotsDirs {
	screenshotsDirPaths, err := dirs.GetScreenshotsDirs()
	if err != nil {
		return ScreenshotsDirsError(err)
	}
	screenshotsDirs := []screenshots.ScreenshotsDir{}
	for _, path := range screenshotsDirPaths {
		screenshotsDirs = append(screenshotsDirs, screenshots.NewScreenshotsDirFromPath(path, SHORT_SCREENSHOTS_LIMIT))
	}
	return ScreenshotsDirs{ScreenshotsDirs: screenshotsDirs}
}

type ScreenshotsDir struct {
	Error          string                     `json:"error,omitempty"`
	ScreenshotsDir screenshots.ScreenshotsDir `json:"screenshotsDir"`
}

func ScreenshotsDirError(err error) ScreenshotsDir {
	return ScreenshotsDir{Error: err.Error()}
}

func (a *App) GetScreenshotsForGame(gameId string) ScreenshotsDir {
	screenshotsDirPath, err := dirs.GetScreenshotsDir(gameId)
	if err != nil {
		return ScreenshotsDirError(err)
	}
	screenshotsDir := screenshots.NewScreenshotsDirFromPath(screenshotsDirPath, 0)
	return ScreenshotsDir{ScreenshotsDir: screenshotsDir}
}

type Games struct {
	Error string           `json:"error,omitempty"`
	Games []steam.GameInfo `json:"games"`
}

func GamesError(err error) Games {
	return Games{Error: err.Error()}
}

func (a *App) GetGames() Games {
	userId, err := dirs.GetUserId()
	if err != nil {
		return GamesError(err)
	}
	gameDirPaths, err := dirs.GetGameDirectories(userId)
	if err != nil {
		return GamesError(err)
	}
	games := []steam.GameInfo{}
	for _, path := range gameDirPaths {
		gameId := filepath.Base(path)
		gameInfo, err := steam.GetGameInfo(gameId)
		if err != nil {
			continue
		}
		games = append(games, gameInfo)
	}
	return Games{Games: games}
}

func (a *App) OnWindowResize() {
	config := config.GetConfig()

	w, h := runtime.WindowGetSize(a.ctx)
	// fmt.Printf("OnWindowResize: %d, %d\n", w, h)
	config.WindowWidth = w
	config.WindowHeight = h

	config.Save()
}
