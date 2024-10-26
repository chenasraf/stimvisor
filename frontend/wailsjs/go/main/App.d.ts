// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {main} from '../models';

export function GetGameInfo(arg1:string):Promise<main.GameInfoResponse>;

export function GetGames():Promise<main.GamesResponse>;

export function GetLibraryInfo():Promise<main.LibraryInfo>;

export function GetScreenshots():Promise<main.ScreenshotCollectionResponse>;

export function GetScreenshotsForGame(arg1:string):Promise<main.ScreenshotCollectionResponse>;

export function ManageScreenshot(arg1:Array<string>,arg2:string):Promise<void>;

export function NativeOpen(arg1:string):Promise<void>;

export function OnWindowResize():Promise<void>;
