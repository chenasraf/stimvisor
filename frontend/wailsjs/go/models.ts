export namespace main {
	
	export class Games {
	    error?: string;
	    games: steam.GameInfo[];
	
	    static createFrom(source: any = {}) {
	        return new Games(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.error = source["error"];
	        this.games = this.convertValues(source["games"], steam.GameInfo);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ScreenshotsDir {
	    error?: string;
	    screenshotsDir: screenshots.ScreenshotsDir;
	
	    static createFrom(source: any = {}) {
	        return new ScreenshotsDir(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.error = source["error"];
	        this.screenshotsDir = this.convertValues(source["screenshotsDir"], screenshots.ScreenshotsDir);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ScreenshotsDirs {
	    error?: string;
	    screenshotsDirs: screenshots.ScreenshotsDir[];
	
	    static createFrom(source: any = {}) {
	        return new ScreenshotsDirs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.error = source["error"];
	        this.screenshotsDirs = this.convertValues(source["screenshotsDirs"], screenshots.ScreenshotsDir);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class SteamLibraryMeta {
	    error?: string;
	    steamDir: string;
	    userDir: string;
	    gameDirs: string[];
	    syncDir: string;
	
	    static createFrom(source: any = {}) {
	        return new SteamLibraryMeta(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.error = source["error"];
	        this.steamDir = source["steamDir"];
	        this.userDir = source["userDir"];
	        this.gameDirs = source["gameDirs"];
	        this.syncDir = source["syncDir"];
	    }
	}

}

export namespace screenshots {
	
	export class ScreenshotsDir {
	    dir: string;
	    userId: string;
	    gameId: string;
	    gameName: string;
	    screenshots: string[];
	    totalCount: number;
	
	    static createFrom(source: any = {}) {
	        return new ScreenshotsDir(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dir = source["dir"];
	        this.userId = source["userId"];
	        this.gameId = source["gameId"];
	        this.gameName = source["gameName"];
	        this.screenshots = source["screenshots"];
	        this.totalCount = source["totalCount"];
	    }
	}

}

export namespace steam {
	
	export class GameInfo {
	    id: string;
	    name: string;
	    installDir: string;
	
	    static createFrom(source: any = {}) {
	        return new GameInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.installDir = source["installDir"];
	    }
	}

}

