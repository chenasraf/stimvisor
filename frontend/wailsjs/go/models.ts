export namespace main {
	
	export class GamesResponse {
	    error?: string;
	    games: steam.GameInfo[];
	
	    static createFrom(source: any = {}) {
	        return new GamesResponse(source);
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
	export class LibraryInfo {
	    error?: string;
	    steamDir: string;
	    userDir: string;
	    gameDirs: string[];
	    syncDir: string;
	
	    static createFrom(source: any = {}) {
	        return new LibraryInfo(source);
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
	export class ScreenshotCollectionResponse {
	    error?: string;
	    screenshotCollections: screenshots.ScreenshotCollection[];
	
	    static createFrom(source: any = {}) {
	        return new ScreenshotCollectionResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.error = source["error"];
	        this.screenshotCollections = this.convertValues(source["screenshotCollections"], screenshots.ScreenshotCollection);
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

}

export namespace screenshots {
	
	export class ScreenshotEntry {
	    dir: string;
	    path: string;
	    name: string;
	    base64: string;
	    mimeType: string;
	
	    static createFrom(source: any = {}) {
	        return new ScreenshotEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dir = source["dir"];
	        this.path = source["path"];
	        this.name = source["name"];
	        this.base64 = source["base64"];
	        this.mimeType = source["mimeType"];
	    }
	}
	export class ScreenshotCollection {
	    dir: string;
	    userId: string;
	    gameId: string;
	    gameName: string;
	    screenshots: ScreenshotEntry[];
	    totalCount: number;
	
	    static createFrom(source: any = {}) {
	        return new ScreenshotCollection(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dir = source["dir"];
	        this.userId = source["userId"];
	        this.gameId = source["gameId"];
	        this.gameName = source["gameName"];
	        this.screenshots = this.convertValues(source["screenshots"], ScreenshotEntry);
	        this.totalCount = source["totalCount"];
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

