package main

import (
	"context"
	"path/filepath"

	"github.com/chenasraf/stimvisor/config"
	"github.com/chenasraf/stimvisor/dirs"
	"github.com/chenasraf/stimvisor/native"
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

func LibraryMetaInfo(err error) LibraryInfo {
	return LibraryInfo{Error: err.Error()}
}

type LibraryInfo struct {
	Error    string   `json:"error,omitempty"`
	SteamDir string   `json:"steamDir"`
	UserDir  string   `json:"userDir"`
	GameDirs []string `json:"gameDirs"`
	SyncDir  string   `json:"syncDir"`
}

func (a *App) GetLibraryInfo() LibraryInfo {
	p, err := dirs.GetSteamDirectory()
	if err != nil {
		return LibraryMetaInfo(err)
	}
	userDir, err := dirs.GetSteamUserDirectory()
	if err != nil {
		return LibraryMetaInfo(err)
	}
	// fmt.Printf("User Dir: %s\n", userDir)
	userId := filepath.Base(userDir)
	gd, err := dirs.GetGameDirectories(userId)
	if err != nil {
		return LibraryMetaInfo(err)
	}
	syncDir, err := dirs.GetSyncDirectory()
	if err != nil {
		return LibraryMetaInfo(err)
	}
	out := LibraryInfo{
		SteamDir: p,
		GameDirs: gd,
		UserDir:  userDir,
		SyncDir:  syncDir,
	}

	return out
}

type ScreenshotCollectionResponse struct {
	Error                 string                             `json:"error,omitempty"`
	ScreenshotCollections []screenshots.ScreenshotCollection `json:"screenshotCollections"`
}

func ScreenshotCollectionError(err error) ScreenshotCollectionResponse {
	return ScreenshotCollectionResponse{Error: err.Error()}
}

const SHORT_SCREENSHOTS_LIMIT = 5

func (a *App) GetScreenshots() ScreenshotCollectionResponse {
	screenshotsDirPaths, err := dirs.GetScreenshotsDirs()
	if err != nil {
		return ScreenshotCollectionError(err)
	}
	screenshotsDirs := []screenshots.ScreenshotCollection{}
	for _, path := range screenshotsDirPaths {
		screenshotsDirs = append(screenshotsDirs, screenshots.NewScreenshotsDirFromPath(path, SHORT_SCREENSHOTS_LIMIT))
	}
	return ScreenshotCollectionResponse{ScreenshotCollections: screenshotsDirs}
}

func (a *App) GetScreenshotsForGame(gameId string) ScreenshotCollectionResponse {
	screenshotsDirPath, err := dirs.GetScreenshotsDir(gameId)
	if err != nil {
		return ScreenshotCollectionError(err)
	}
	screenshotsDir := screenshots.NewScreenshotsDirFromPath(screenshotsDirPath, 0)
	return ScreenshotCollectionResponse{ScreenshotCollections: []screenshots.ScreenshotCollection{screenshotsDir}}
}

type GamesResponse struct {
	Error string           `json:"error,omitempty"`
	Games []steam.GameInfo `json:"games"`
}

func GamesError(err error) GamesResponse {
	return GamesResponse{Error: err.Error()}
}

func (a *App) GetGames() GamesResponse {
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
	return GamesResponse{Games: games}
}

type GameInfoResponse struct {
	Error string         `json:"error,omitempty"`
	Game  steam.GameInfo `json:"game"`
}

func GameInfoError(err error) GameInfoResponse {
	return GameInfoResponse{Error: err.Error()}
}

func (a *App) GetGameInfo(gameId string) GameInfoResponse {
	gameInfo, err := steam.GetGameInfo(gameId)
	if err != nil {
		return GameInfoError(err)
	}
	return GameInfoResponse{Game: gameInfo}
}

func (a *App) OnWindowResize() {
	config := config.GetConfig()

	w, h := runtime.WindowGetSize(a.ctx)
	// fmt.Printf("OnWindowResize: %d, %d\n", w, h)
	config.WindowWidth = w
	config.WindowHeight = h

	config.Save()
}

func (a *App) NativeOpen(path string) error {
	return native.NativeOpen(path)
}
