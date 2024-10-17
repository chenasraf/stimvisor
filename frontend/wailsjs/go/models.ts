export namespace main {
	
	export class SteamLibraryMeta {
	    error?: string;
	    steamDir: string;
	    userDir: string;
	    gameDirs: string[];
	    screenshotsDirs: string[];
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
	        this.screenshotsDirs = source["screenshotsDirs"];
	        this.syncDir = source["syncDir"];
	    }
	}

}

