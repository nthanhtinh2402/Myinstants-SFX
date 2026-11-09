const translations = {
    en: {
        searchPlaceholder: "Type to search SFX... (Press Enter)",
        btnSearch: "Search",
        loadingSfx: "Loading trending audio...",
        supportedPlatforms: "Supported:",
        urlPlaceholder: "Paste video/audio link here... (Press Enter)",
        optVideo: "Best Video (Merged Audio + Video)",
        optAudio: "Audio Only (M4A - Fast & Smooth)",
        btnDownload: "Download",
        lblLanguage: "LANGUAGE:",
        lblTheme: "THEME COLOR:",
        lblSavePath: "DOWNLOAD DIRECTORY:",
        pathPlaceholder: "Leave blank = Save with Project",
        btnResetPath: "Reset to Project Folder",
        btnSaveSettings: "Save Settings",
        donationTitle: "Support Author",
        btnViewQr: "View QR",
        autoInsertTimeline: "Auto insert into Timeline",
        btnClearLog: "Clear Log",
        readyLog: "Ready to work",
        logCleared: "Log cleared. Ready!",
        settingsSaved: "Settings saved successfully!",
        pathReset: "Download path reset to Project directory.",
        downloadingMedia: "Starting download...",
        downloadComplete: "Download complete! Processing...",
        importBin: "Added to Project Bin",
        netError: "Network error",
        folderDialog: "Select default download folder",
        addedTrack: "Smart Inserted (Dodged existing clips)",
        alreadyDownloaded: "Re-using existing file from Bin"
    },
    vi: {
        searchPlaceholder: "Gõ để tìm SFX... (Nhấn Enter)",
        btnSearch: "Tìm",
        loadingSfx: "Đang tải âm thanh thịnh hành...",
        supportedPlatforms: "Hỗ trợ:",
        urlPlaceholder: "Dán link video/audio vào đây... (Nhấn Enter)",
        optVideo: "Video Nét Nhất (Có ghép Tiếng + Hình)",
        optAudio: "Chỉ Âm Thanh (M4A - Nhanh, mượt)",
        btnDownload: "Tải Xuống",
        lblLanguage: "NGÔN NGỮ (LANGUAGE):",
        lblTheme: "MÀU CHỦ ĐẠO:",
        lblSavePath: "THƯ MỤC LƯU FILE:",
        pathPlaceholder: "Để trống = Lưu chung với Project",
        btnResetPath: "Reset về thư mục Project",
        btnSaveSettings: "Lưu Cài Đặt",
        donationTitle: "Ủng hộ tác giả (Support Author)",
        btnViewQr: "Mở QR",
        autoInsertTimeline: "Tự động chèn xuống Timeline",
        btnClearLog: "Xóa Log",
        readyLog: "Sẵn sàng hoạt động",
        logCleared: "Đã xóa log. Sẵn sàng!",
        settingsSaved: "Đã lưu cài đặt thành công!",
        pathReset: "Đã reset đường dẫn về thư mục Project.",
        downloadingMedia: "Bắt đầu tải...",
        downloadComplete: "Tải hoàn tất! Đang xử lý...",
        importBin: "Đã bỏ vào Project Bin",
        netError: "Lỗi mạng",
        folderDialog: "Chọn thư mục lưu file mặc định",
        addedTrack: "Đã chèn Timeline (An toàn không đè file sau)",
        alreadyDownloaded: "Dùng lại file cũ trong Bin (Không rác)"
    }
};

Object.assign(translations.en, {
    lblApiToken: "MYINSTANTS API TOKEN:", tokenPlaceholder: "Optional token (anonymous: 10 requests/minute)",
    lblUpdater: "EXTENSION UPDATE:", updateReady: "Checking GitHub Releases...", btnCheckUpdate: "Check for updates",
    favorites: "Favorites", favoritesTitle: "Favorite sounds", noFavorites: "No favorite sounds yet.", allTags: "All tags"
});
Object.assign(translations.vi, {
    lblSfxApi: "URL API SFX:", lblUpdater: "CẬP NHẬT EXTENSION:",
    updateUrlPlaceholder: "Link Google Drive của update-manifest.json",
    updateReady: "Nhập link manifest cập nhật, sau đó lưu cài đặt.", btnCheckUpdate: "Kiểm Tra & Cập Nhật"
});
Object.assign(translations.vi, {
    lblApiToken: "MYINSTANTS API TOKEN:", tokenPlaceholder: "Token tùy chọn (ẩn danh: 10 yêu cầu/phút)",
    lblUpdater: "CẬP NHẬT EXTENSION:", updateReady: "Đang kiểm tra GitHub Releases...", btnCheckUpdate: "Kiểm tra cập nhật",
    favorites: "Yêu thích", favoritesTitle: "Âm thanh yêu thích", noFavorites: "Chưa có âm thanh yêu thích.", allTags: "Tất cả tag"
});

function getLang() { return localStorage.getItem("language") || "en"; }
function t(key) { const lang = getLang(); return translations[lang][key] || translations["en"][key] || key; }

function updateTexts() {
    document.querySelectorAll("[data-i18n]").forEach(el => { el.innerText = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder"))); });
}

function log(msg, color = "#ccc") {
    const logBox = document.getElementById("log");
    if(logBox) {
        const time = new Date().toLocaleTimeString();
        logBox.innerHTML += `<div style="color:${color}">[${time}] ${msg}</div>`;
        logBox.scrollTop = logBox.scrollHeight;
    }
}

document.getElementById('btnClearLog').onclick = () => {
    document.getElementById("log").innerHTML = `<div style="color:#0f0">[${new Date().toLocaleTimeString()}] ${t('logCleared')}</div>`;
};

const tabs = [
    { btn: "tabMyInstants", content: "contentMyInstants" },
    { btn: "tabFavorites", content: "contentFavorites" },
    { btn: "tabYoutube", content: "contentYoutube" },
    { btn: "tabSettings", content: "contentSettings" },
    { btn: "tabDonation", content: "contentDonation" }
];

tabs.forEach(tab => {
    document.getElementById(tab.btn).onclick = () => {
        tabs.forEach(t => {
            document.getElementById(t.btn).classList.remove("active");
            document.getElementById(t.content).classList.remove("active");
        });
        document.getElementById(tab.btn).classList.add("active");
        document.getElementById(tab.content).classList.add("active");
        if (tab.btn === "tabFavorites" && typeof renderFavorites === "function") renderFavorites();
    };
});

let csInterface = null, https, http, fs, path, os, cp, crypto, isNodeReady = false, hasLoadedTrending = false;
let downloadHistory = {}; 
let globalSfxDir = ""; 

try { if (typeof CSInterface !== "undefined") csInterface = new CSInterface(); } catch(e) {}
try {
    if (typeof require !== "undefined") {
        https = require('https'); http = require('http'); fs = require('fs'); path = require('path'); os = require('os'); cp = require('child_process'); crypto = require('crypto'); isNodeReady = true;
    } else { log("LỖI: Node.js chưa bật!", "#ff4444"); }
} catch (e) {}

function applyTheme(color) {
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-bg', color + "20");
}

function loadSettings() {
    const savedColor = localStorage.getItem("themeColor") || "#e74c3c";
    const savedPath = localStorage.getItem("customPath") || "";
    const savedLang = getLang();
    const savedApiToken = localStorage.getItem("sfxApiToken") || "";
    document.getElementById("colorPicker").value = savedColor;
    document.getElementById("customPath").value = savedPath;
    document.getElementById("langSelect").value = savedLang;
    document.getElementById("sfxApiToken").value = savedApiToken;
    applyTheme(savedColor); updateTexts();
}

document.getElementById("btnBrowse").onclick = () => {
    const result = window.cep.fs.showOpenDialog(false, true, t('folderDialog'), "", "");
    if(result.data && result.data.length > 0) document.getElementById("customPath").value = result.data[0];
};

document.getElementById("btnClearPath").onclick = () => { document.getElementById("customPath").value = ""; log(t('pathReset')); };

document.getElementById("btnSaveSettings").onclick = () => {
    const color = document.getElementById("colorPicker").value, customPath = document.getElementById("customPath").value, lang = document.getElementById("langSelect").value;
    const sfxApiToken = document.getElementById("sfxApiToken").value.trim();
    localStorage.setItem("themeColor", color); localStorage.setItem("customPath", customPath); localStorage.setItem("language", lang);
    localStorage.setItem("sfxApiToken", sfxApiToken);
    applyTheme(color); updateTexts(); log(t('settingsSaved'), "#00ff00"); document.getElementById("tabMyInstants").click();
    getDownloadDirectory("SFX").then(dir => globalSfxDir = dir); 
};
document.getElementById("btnClearToken").onclick = () => { document.getElementById("sfxApiToken").value = ""; localStorage.removeItem("sfxApiToken"); };
loadSettings();

function getDownloadDirectory(subFolder) {
    return new Promise((resolve) => {
        const customPath = localStorage.getItem("customPath");
        if (customPath && customPath !== "" && fs.existsSync(customPath)) {
            const targetDir = path.join(customPath, subFolder);
            if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
            return resolve(targetDir);
        }
        csInterface.evalScript("getProjectPath()", (projPath) => {
            let baseDir = os.tmpdir();
            if (projPath && projPath !== "") baseDir = path.dirname(projPath);
            const targetDir = path.join(baseDir, "Media_Downloads", subFolder);
            if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
            resolve(targetDir);
        });
    });
}

if(isNodeReady) getDownloadDirectory("SFX").then(dir => globalSfxDir = dir);

function importFileToPremiere(filePath, binName, mediaDuration = 30) {
    if(!csInterface) return;
    const safePath = filePath.replace(/\\/g, '/'); 
    const autoInsertBox = document.getElementById("autoInsertTimeline");
    const doInsert = autoInsertBox ? autoInsertBox.checked : false;
    
    const fileNameOnly = safePath.split('/').pop().replace(/"/g, '\\"');
    
    const lang = getLang();
    const alertPrefix = lang === 'vi' ? "Không gian phía sau Playhead trên các Track hiện tại không đủ khoảng trống (" : "Not enough space after the Playhead on current tracks (";
    const alertSuffix = lang === 'vi' ? " giây).\\n\\nVui lòng nhấp chuột phải vào Timeline -> chọn 'Add Tracks' để tạo thêm Track, hoặc xóa bớt clip ngáng đường!" : " seconds).\\n\\nPlease right-click the Timeline -> choose 'Add Tracks', or clear blocking clips!";
    
    const jsxScript = `
    (function() {
        try {
            var project = app.project;
            if (!project) return "ERROR_NO_PROJECT";

            var targetBin = project.rootItem;
            var binName = "${binName}";
            var filePath = "${safePath}";
            var fileNameOnly = "${fileNameOnly}".toLowerCase();
            var doInsert = ${doInsert};
            var checkDuration = ${mediaDuration}; 

            var foundBin = false;
            for (var i = 0; i < project.rootItem.children.numItems; i++) {
                var item = project.rootItem.children[i];
                if (item.name === binName && (item.type === ProjectItemType.BIN || item.type === 2)) {
                    targetBin = item; foundBin = true; break;
                }
            }
            if (!foundBin) targetBin = project.rootItem.createBin(binName);

            var importedItem = null;
            for (var j = 0; j < targetBin.children.numItems; j++) {
                var child = targetBin.children[j];
                if (child.type === ProjectItemType.CLIP || child.type === 1 || child.type === ProjectItemType.FILE || child.type === 4) {
                    if (child.name.toLowerCase() === fileNameOnly) { 
                        importedItem = child; break; 
                    }
                }
            }

            if (!importedItem) {
                project.importFiles([filePath], true, targetBin, false);
                for (var k = 0; k < targetBin.children.numItems; k++) {
                    var c = targetBin.children[k];
                    if (c.type === ProjectItemType.CLIP || c.type === 1 || c.type === ProjectItemType.FILE || c.type === 4) {
                        if (c.name.toLowerCase() === fileNameOnly) {
                            importedItem = c; break;
                        }
                    }
                }
            }

            if (doInsert && importedItem) {
                var seq = project.activeSequence;
                if (seq) {
                    var time = seq.getPlayerPosition();
                    var timeSec = time.seconds;
                    
                    function getEmptyTrack(tracks) {
                        if (!tracks || tracks.numTracks === 0) return -1;
                        for (var t = 0; t < tracks.numTracks; t++) {
                            var isEmpty = true;
                            for (var c = 0; c < tracks[t].clips.numItems; c++) {
                                var clip = tracks[t].clips[c];
                                if (clip.start.seconds < (timeSec + checkDuration) && clip.end.seconds > timeSec) {
                                    isEmpty = false; break;
                                }
                            }
                            if (isEmpty) return t; 
                        }
                        return -1; 
                    }

                    var safeVideoTrack = getEmptyTrack(seq.videoTracks);
                    var safeAudioTrack = getEmptyTrack(seq.audioTracks);
                    
                    if (safeVideoTrack === -1 || safeAudioTrack === -1) {
                        alert("⚠️ MYINSTANTS DOWNLOADER:\\n\\n${alertPrefix}" + checkDuration.toFixed(1) + "${alertSuffix}");
                        return "ERROR_OUT_OF_TRACKS";
                    }
                    
                    if (seq.videoTracks.numTracks > 0) seq.videoTracks[safeVideoTrack].setTargeted(true, true);
                    if (seq.audioTracks.numTracks > 0) seq.audioTracks[safeAudioTrack].setTargeted(true, true);
                    
                    seq.overwriteClip(importedItem, time.ticks, safeVideoTrack, safeAudioTrack);
                    
                    return "SUCCESS_INSERTED";
                }
            }
            return "SUCCESS";
        } catch(e) { return "ERROR: " + e.message; }
    })();
    `;

    csInterface.evalScript(jsxScript, (res) => {
        const fileName = filePath.split('/').pop();
        if (res === "SUCCESS_INSERTED") log(`✅ ${fileName} -> ${t('addedTrack')}`, "#00ff00");
        else if (res === "ERROR_OUT_OF_TRACKS") log(`⚠️ Timeline Full!`, "#f39c12");
        else if (res === "SUCCESS") log(`✅ ${fileName} -> ${t('importBin')}`, "#00ff00");
        else log(`Import Error: ${res}`, "#ff4444");
    });
}

document.getElementById("btnYtDownload").onclick = () => handleYtDownload();
document.getElementById("ytUrl").addEventListener("keypress", (e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("btnYtDownload").click(); }});

async function handleYtDownload() {
    if(!isNodeReady) return;
    const url = document.getElementById("ytUrl").value.trim();
    if (!url) return;

    const btnDl = document.getElementById("btnYtDownload"); btnDl.disabled = true;

    try {
        const targetDir = await getDownloadDirectory("Downloads");

        if (downloadHistory[url] && fs.existsSync(downloadHistory[url])) {
            log(`⚡ ${t('alreadyDownloaded')} (${path.basename(downloadHistory[url])})`, "#3498db");
            importFileToPremiere(downloadHistory[url], "Media Downloads", 300);
            btnDl.disabled = false; return;
        }

        let extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION);
        if (extensionRoot.indexOf('file:\\') === 0) extensionRoot = extensionRoot.substring(6);
        else if (extensionRoot.indexOf('file:///') === 0) extensionRoot = extensionRoot.substring(8);
        extensionRoot = decodeURI(extensionRoot);

        // NHẬN DIỆN HỆ ĐIỀU HÀNH & CẤP QUYỀN
        const isMac = os.platform() === 'darwin'; 
        
        const ytDlpFileName = isMac ? 'yt-dlp_mac' : 'yt-dlp.exe';
        const ffmpegFileName = isMac ? 'ffmpeg_mac' : 'ffmpeg.exe';

        const ytDlpPath = path.join(extensionRoot, ytDlpFileName);
        const ffmpegPath = path.join(extensionRoot, ffmpegFileName);

        if (!fs.existsSync(ytDlpPath)) throw new Error(`Công cụ ${ytDlpFileName} không tồn tại`);
        
        if (isMac) {
            try {
                fs.chmodSync(ytDlpPath, 0o755); 
                if (fs.existsSync(ffmpegPath)) fs.chmodSync(ffmpegPath, 0o755);
            } catch (permErr) {
                log(`Lưu ý: Không thể tự cấp quyền Mac - ${permErr.message}`, "#f39c12");
            }
        }

        const formatSelect = document.getElementById("ytFormat").value;
        let formatFlag = (formatSelect === "audio_m4a") ? "ba[ext=m4a]/ba" : "bv+ba/b";

        const destPathTmpl = path.join(targetDir, `%(title)s.%(ext)s`);

        const logBox = document.getElementById("log"); const progressId = "prog_" + Date.now(); const timeStr = new Date().toLocaleTimeString();
        logBox.innerHTML += `<div style="color:#f39c12" id="${progressId}">[${timeStr}] ${t('downloadingMedia')} 0%</div>`;
        logBox.scrollTop = logBox.scrollHeight; const progressElem = document.getElementById(progressId);

        let detectedFilePath = "";

        await new Promise((resolve, reject) => {
            const args = [ '-f', formatFlag, '--no-playlist', '--merge-output-format', 'mp4', url, '-o', destPathTmpl ];
            if (fs.existsSync(ffmpegPath)) args.push('--ffmpeg-location', extensionRoot);

            const ytProcess = cp.spawn(ytDlpPath, args);
            let errorLog = "";

            ytProcess.stdout.on('data', (data) => {
                const output = data.toString();
                const matchProg = output.match(/\[download\]\s+(\d+\.\d+)%/);
                if (matchProg && matchProg[1] && progressElem) progressElem.innerText = `[${timeStr}] Progress: ${matchProg[1]}%`;

                if (output.includes('Destination: ')) { const m = output.match(/Destination:\s*(.*)/); if (m) detectedFilePath = m[1].trim(); }
                if (output.includes('Merging formats into "')) { const m = output.match(/Merging formats into "(.*?)"/); if (m) detectedFilePath = m[1].trim(); }
                if (output.includes('has already been downloaded')) { const m = output.match(/\[download\]\s*(.*?)\s*has already been/); if (m) detectedFilePath = m[1].trim(); }
            });

            ytProcess.stderr.on('data', (data) => { errorLog += data.toString(); });
            ytProcess.on('close', (code) => {
                if (code === 0 && !errorLog.includes("ERROR:")) {
                    if(progressElem) progressElem.innerText = `[${timeStr}] ${t('downloadComplete')}`;
                    resolve();
                } else { reject(new Error(errorLog || "yt-dlp error code " + code)); }
            });
        });

        setTimeout(() => {
            let finalPath = detectedFilePath;
            
            if (!finalPath || !fs.existsSync(finalPath)) {
                const filesList = fs.readdirSync(targetDir)
                    .filter(f => fs.statSync(path.join(targetDir, f)).isFile())
                    .map(f => ({ name: f, time: fs.statSync(path.join(targetDir, f)).mtime.getTime() }))
                    .sort((a, b) => b.time - a.time);
                if (filesList.length > 0) finalPath = path.join(targetDir, filesList[0].name);
            }

            if (finalPath && fs.existsSync(finalPath)) {
                downloadHistory[url] = finalPath;
                importFileToPremiere(finalPath, "Media Downloads", 300);
            } else {
                throw new Error("Could not locate downloaded file.");
            }
            btnDl.disabled = false;
        }, 800);

    } catch (err) { log(`YT Error: ${err.message}`, "#ff4444"); btnDl.disabled = false; }
}

if (false) { // Legacy proxy/Drive updater retained only for easy comparison; never executed.
function fetchNode(url, retries = 2) {
    return new Promise((resolve, reject) => {
        const transport = url.indexOf("https:") === 0 ? https : http;
        const req = transport.get(url, { headers: { "User-Agent": "MyInstants-SFX-CEP/1.2.0", "Accept": "application/json" } }, (res) => {
            let rawData = '';
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return fetchNode(res.headers.location).then(resolve).catch(reject);
            res.on('data', chunk => rawData += chunk);
            res.on('end', () => { 
                if ((res.statusCode === 429 || res.statusCode >= 500) && retries > 0) {
                    return setTimeout(() => fetchNode(url, retries - 1).then(resolve).catch(reject), (3 - retries) * 700);
                }
                if (res.statusCode !== 200) return reject(new Error(res.statusCode === 503 ? "SFX API is temporarily unavailable (HTTP 503). Configure another API URL in Settings." : `HTTP Error ${res.statusCode}`));
                try { resolve(JSON.parse(rawData)); } catch(e) { reject(new Error("JSON Parse Error")); } 
            });
        });
        req.setTimeout(20000, () => req.destroy(new Error("Request timeout")));
        req.on('error', err => reject(new Error(err.message || t('netError'))));
    });
}

function driveDirectUrl(url) {
    const match = String(url || "").match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([-\w]+)/i);
    return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : url;
}

function fetchBuffer(url, redirects = 0) {
    return new Promise((resolve, reject) => {
        if (redirects > 8) return reject(new Error("Too many redirects"));
        const finalUrl = driveDirectUrl(url), transport = finalUrl.indexOf("https:") === 0 ? https : http;
        const req = transport.get(finalUrl, { headers: { "User-Agent": "MyInstants-SFX-Updater/1.2.0", "Accept": "*/*" } }, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                const next = new URL(res.headers.location, finalUrl).toString();
                res.resume(); return fetchBuffer(next, redirects + 1).then(resolve).catch(reject);
            }
            const chunks = [];
            res.on("data", chunk => chunks.push(chunk));
            res.on("end", () => res.statusCode === 200 ? resolve(Buffer.concat(chunks)) : reject(new Error(`HTTP ${res.statusCode}`)));
        });
        req.setTimeout(60000, () => req.destroy(new Error("Request timeout")));
        req.on("error", reject);
    });
}

function compareVersions(a, b) {
    const left = String(a).split(/[.-]/).map(n => parseInt(n, 10) || 0), right = String(b).split(/[.-]/).map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(left.length, right.length); i++) { const d = (left[i] || 0) - (right[i] || 0); if (d) return d; }
    return 0;
}

function extensionRootPath() {
    let root = csInterface.getSystemPath(SystemPath.EXTENSION);
    if (root.indexOf('file:\\') === 0) root = root.substring(6); else if (root.indexOf('file:///') === 0) root = root.substring(8);
    return decodeURI(root);
}

function currentExtensionVersion() {
    const xml = fs.readFileSync(path.join(extensionRootPath(), "CSXS", "manifest.xml"), "utf8");
    const match = xml.match(/ExtensionBundleVersion="([^"]+)"/);
    return match ? match[1] : "0.0.0";
}

function setUpdateStatus(message, color) {
    const el = document.getElementById("updateStatus"); if (el) { el.innerText = message; el.style.color = color || "#aaa"; }
}

function psQuote(value) { return "'" + String(value).replace(/'/g, "''") + "'"; }

async function installZxpUpdate(zxpBuffer, version, expectedSha256) {
    if (expectedSha256) {
        const actual = crypto.createHash("sha256").update(zxpBuffer).digest("hex");
        if (actual.toLowerCase() !== String(expectedSha256).toLowerCase()) throw new Error("SHA-256 checksum does not match");
    }
    if (os.platform() !== "win32") throw new Error("Automatic ZXP installation currently supports Windows only");
    const tempDir = path.join(os.tmpdir(), "MyInstants-SFX-update-" + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });
    const zxpPath = path.join(tempDir, "update.zxp"), scriptPath = path.join(tempDir, "install-update.ps1");
    fs.writeFileSync(zxpPath, zxpBuffer);
    const cleanVersion = String(version).replace(/'/g, "");
    const script = [
        "$ErrorActionPreference = 'Stop'", "Start-Sleep -Seconds 2",
        `$zip = ${psQuote(path.join(tempDir, "update.zip"))}`,
        `$stage = ${psQuote(path.join(tempDir, "expanded"))}`,
        `$target = ${psQuote(extensionRootPath())}`,
        `Copy-Item -LiteralPath ${psQuote(zxpPath)} -Destination $zip -Force`,
        "Expand-Archive -LiteralPath $zip -DestinationPath $stage -Force",
        "if (-not (Test-Path -LiteralPath (Join-Path $stage 'CSXS\\manifest.xml'))) { throw 'Invalid ZXP: CSXS/manifest.xml is missing' }",
        "Copy-Item -Path (Join-Path $stage '*') -Destination $target -Recurse -Force",
        `Add-Content -LiteralPath (Join-Path $target 'update.log') -Value ('Installed ${cleanVersion} at ' + (Get-Date))`,
        "Add-Type -AssemblyName PresentationFramework",
        `[System.Windows.MessageBox]::Show('MyInstants SFX ${cleanVersion} installed. Restart Premiere Pro to load it.', 'Update complete') | Out-Null`
    ].join("\r\n");
    fs.writeFileSync(scriptPath, script, "utf8");
    const command = `Start-Process -FilePath 'powershell.exe' -Verb RunAs -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',${psQuote(scriptPath)})`;
    const child = cp.spawn("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command], { detached: true, stdio: "ignore" });
    child.unref();
}

document.getElementById("btnCheckUpdate").onclick = async () => {
    if (!isNodeReady) return setUpdateStatus("Node.js is not available.", "#ff4444");
    const button = document.getElementById("btnCheckUpdate"), manifestUrl = document.getElementById("updateManifestUrl").value.trim();
    if (!manifestUrl) return setUpdateStatus("Please enter a Google Drive manifest link first.", "#f39c12");
    button.disabled = true;
    try {
        setUpdateStatus("Checking for updates...", "#f39c12");
        const manifestBuffer = await fetchBuffer(manifestUrl);
        const manifest = JSON.parse(manifestBuffer.toString("utf8").replace(/^\uFEFF/, ""));
        if (!manifest.version || !manifest.zxpUrl) throw new Error("Manifest must contain version and zxpUrl");
        const current = currentExtensionVersion();
        if (compareVersions(manifest.version, current) <= 0) return setUpdateStatus(`You already have the latest version (${current}).`, "#00cc66");
        setUpdateStatus(`Downloading v${manifest.version}...`, "#f39c12");
        const zxpBuffer = await fetchBuffer(manifest.zxpUrl);
        if (zxpBuffer.length < 4 || zxpBuffer[0] !== 0x50 || zxpBuffer[1] !== 0x4b) throw new Error("Downloaded file is not a ZXP/ZIP. Check Drive sharing permission.");
        setUpdateStatus("Starting installer. Accept the Windows administrator prompt...", "#3498db");
        await installZxpUpdate(zxpBuffer, manifest.version, manifest.sha256);
    } catch (err) { setUpdateStatus("Update error: " + err.message, "#ff4444"); log("Update error: " + err.message, "#ff4444"); }
    finally { button.disabled = false; }
};

async function downloadMp3Browser(mp3Url, destPath) {
    let res;
    try { res = await fetch(mp3Url); if (!res.ok) throw new Error("Blocked 403"); } 
    catch(e) { res = await fetch(`https://corsproxy.io/?${encodeURIComponent(mp3Url)}`); }
    if (!res || !res.ok) throw new Error(t('netError'));
    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
    return destPath;
}

const dragGripIcon = `<svg style="width: 20px; height: 20px; cursor: grab; color: #888;" viewBox="0 0 24 24" fill="currentColor"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`;
const playIcon = `<svg viewBox="0 0 24 24" style="margin-left: 2px;"><path d="M8 5v14l11-7z"/></svg>`;
const pauseIcon = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
let currentAudio = null, currentIndex = -1, currentPage = 1, currentKeyword = "", isLoading = false, hasMoreData = true;

const emptyDragImage = new Image();
emptyDragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function formatTime(s) { if (isNaN(s)) return "0:00"; let m = Math.floor(s / 60), sec = Math.floor(s % 60); return m + ":" + (sec < 10 ? "0" : "") + sec; }

async function loadSFXData(keyword, isLoadMore = false) {
    if (isLoading || (!hasMoreData && isLoadMore)) return;
    isLoading = true; const resBox = document.getElementById("sfxResults");

    if (!isLoadMore) { currentPage = 1; currentKeyword = keyword; hasMoreData = true; resBox.innerHTML = `<div style='color:var(--primary); text-align:center; padding: 20px;'>${t('loadingSfx')}</div>`; } 
    else { currentPage++; const loader = document.createElement("div"); loader.id = "sfx-loader"; loader.style.cssText = "color:var(--primary); text-align:center; padding: 10px; font-size: 11px;"; loader.innerText = "..."; resBox.appendChild(loader); }

    try {
        const apiBase = (localStorage.getItem("sfxApiUrl") || "https://myinstants-api.vercel.app").replace(/\/$/, "");
        const data = await fetchNode(`${apiBase}/search?q=${encodeURIComponent(keyword)}&page=${currentPage}`); 
        if (isLoadMore) { const loader = document.getElementById("sfx-loader"); if (loader) loader.remove(); }
        if (!data.data || data.data.length === 0) { 
            if (!isLoadMore) resBox.innerHTML = "<div style='color:#ccc; text-align:center; padding: 20px;'>No SFX found!</div>"; 
            else { const endMsg = document.createElement("div"); endMsg.style.cssText = "color:#666; text-align:center; padding: 10px; font-size: 11px;"; endMsg.innerText = "No more results."; resBox.appendChild(endMsg); }
            hasMoreData = false; isLoading = false; return; 
        }
        if (!isLoadMore) resBox.innerHTML = "";
        const startIndex = (currentPage - 1) * 20; 
        
        data.data.forEach((sound, indexOffset) => {
            const index = startIndex + indexOffset;
            let hash = 0; for(let i=0; i<sound.title.length; i++) hash += sound.title.charCodeAt(i);
            let bars = ''; for(let i=0; i<45; i++) { let h = Math.abs(Math.sin(hash + i * 1.5)) * 70 + 30; bars += `<div class="wave-bar" style="height: ${h}%"></div>`; }
            
            const item = document.createElement("div"); 
            item.className = "sound-item";
            item.setAttribute("draggable", "true");
            
            item.innerHTML = `
                <div class="drag-handle" title="Hold to drag" style="display:flex; align-items:center; padding-right:5px; padding-left:5px;">
                    ${dragGripIcon}
                </div>
                <div class="play-btn" id="play-${index}" data-mp3="${sound.mp3}">${playIcon}</div>
                <div class="sound-info" style="cursor:pointer;">
                    <div class="sound-title" title="${sound.title}">${sound.title}</div>
                    <div class="waveform-wrapper"><div class="waveform-container" id="wave-${index}">${bars}</div><div class="time-display" id="time-${index}">0:00</div></div>
                </div>
                <button class="btn-dl" data-mp3="${sound.mp3}" data-title="${sound.title}">Import</button>
            `;
            
            const safeName = sound.title.replace(/[\\/:*?"<>|]/g, "").trim() + ".mp3";
            let holdTimer = null;
            let isDragPrepared = false;

            item.addEventListener('mousedown', (e) => {
                if (e.target.closest('.btn-dl')) return; 
                isDragPrepared = false;
                
                holdTimer = setTimeout(() => {
                    isDragPrepared = true;
                    if(globalSfxDir && isNodeReady) {
                        const destPath = path.join(globalSfxDir, safeName);
                        if (!fs.existsSync(destPath)) {
                            downloadMp3Browser(sound.mp3, destPath).catch(()=>{});
                        }
                    }
                }, 150); 
            });

            item.addEventListener('mouseup', (e) => {
                clearTimeout(holdTimer);
                if (e.target.closest('.btn-dl')) return;

                if (!isDragPrepared) {
                    const playBtn = item.querySelector('.play-btn');
                    if(playBtn) {
                        const mp3Url = playBtn.dataset.mp3;
                        if (currentIndex === index && currentAudio) { 
                            if (!currentAudio.paused) { currentAudio.pause(); playBtn.innerHTML = playIcon; } 
                            else { currentAudio.play(); playBtn.innerHTML = pauseIcon; } 
                            return; 
                        }
                        if (currentAudio) {
                            currentAudio.pause(); const prevBtn = document.getElementById(`play-${currentIndex}`); if (prevBtn) prevBtn.innerHTML = playIcon;
                            if (currentIndex !== -1) { const oldBars = document.getElementById(`wave-${currentIndex}`); if (oldBars) { for(let i=0; i<oldBars.children.length; i++) oldBars.children[i].style.background = '#444'; document.getElementById(`time-${currentIndex}`).innerText = "0:00"; } }
                        }
                        currentIndex = index; playBtn.innerHTML = pauseIcon; currentAudio = new Audio(mp3Url); currentAudio.play();
                        const timeDisplay = document.getElementById(`time-${index}`); const bars = document.getElementById(`wave-${index}`).children;
                        currentAudio.ontimeupdate = () => {
                            if (!currentAudio.duration) return;
                            const pct = currentAudio.currentTime / currentAudio.duration; const activeCount = Math.floor(pct * bars.length);
                            for(let i=0; i<bars.length; i++) bars[i].style.background = i <= activeCount ? 'var(--primary)' : '#444'; timeDisplay.innerText = formatTime(currentAudio.currentTime);
                        };
                        currentAudio.onended = () => { playBtn.innerHTML = playIcon; timeDisplay.innerText = "0:00"; for(let i=0; i<bars.length; i++) bars[i].style.background = '#444'; currentIndex = -1; };
                    }
                }
            });

            item.addEventListener('mouseleave', () => { clearTimeout(holdTimer); });

            item.addEventListener('dragstart', (e) => {
                if(!globalSfxDir || !isNodeReady) { e.preventDefault(); return; }
                e.dataTransfer.setDragImage(emptyDragImage, 0, 0);

                const destPath = path.join(globalSfxDir, safeName);
                if (fs.existsSync(destPath)) {
                    e.dataTransfer.setData("com.adobe.cep.dnd.file.0", destPath);
                    e.dataTransfer.effectAllowed = "copy";
                } else {
                    e.preventDefault();
                    log("Đang nạp file, vui lòng giữ im chuột 1 giây trước khi kéo!", "#f39c12");
                }
            });

            item.addEventListener('dragend', (e) => {
                if(!isNodeReady) return;
                const cleanupScript = `
                (function() {
                    try {
                        var project = app.project;
                        if (!project) return;
                        var root = project.rootItem;
                        var binName = "MyInstants SFX";
                        var targetName = "${safeName.replace(/"/g, '\\"')}".toLowerCase();

                        var targetBin = null;
                        for (var i = 0; i < root.children.numItems; i++) {
                            var child = root.children[i];
                            if (child.name === binName && (child.type === ProjectItemType.BIN || child.type === 2)) {
                                targetBin = child; break;
                            }
                        }
                        if (!targetBin) targetBin = root.createBin(binName);

                        for (var j = root.children.numItems - 1; j >= 0; j--) {
                            var item = root.children[j];
                            if (item && item.type !== 2 && item.name && item.name.toLowerCase() === targetName) {
                                item.moveBin(targetBin);
                            }
                        }
                    } catch(err) {}
                })();
                `;
                setTimeout(() => { csInterface.evalScript(cleanupScript); }, 800);
            });

            resBox.appendChild(item);
        });
    } catch(err) { if (!isLoadMore) resBox.innerHTML = `<div style="color:red; text-align:center;">Network Error: ${err.message}</div>`; hasMoreData = false; } finally { isLoading = false; }
}

document.getElementById("sfxResults").addEventListener("scroll", function() { if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) { if (!isLoading && hasMoreData) loadSFXData(currentKeyword, true); }});

document.getElementById("sfxResults").addEventListener("click", function(e) {
    const dlBtn = e.target.closest('.btn-dl');
    if (dlBtn) {
        const url = dlBtn.dataset.mp3; const title = dlBtn.dataset.title.replace(/[\\/:*?"<>|]/g, "").trim(); const safeName = title + ".mp3";
        dlBtn.innerText = "...";
        const audioDurFetcher = new Audio(url);
        audioDurFetcher.addEventListener('loadedmetadata', () => {
            const actualDuration = audioDurFetcher.duration;
            getDownloadDirectory("SFX").then(targetDir => {
                const destPath = path.join(targetDir, safeName);
                downloadMp3Browser(url, destPath).then(() => {
                    importFileToPremiere(destPath, "MyInstants SFX", actualDuration); 
                    dlBtn.innerText = "Done!"; setTimeout(() => dlBtn.innerText = "Import", 2000);
                }).catch(err => { log(`Error: ${err.message}`, "#ff4444"); dlBtn.innerText = "Error!"; });
            });
        });
        audioDurFetcher.load(); 
    }
});

document.getElementById("sfxKeyword").addEventListener("keypress", (e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("btnSearchSfx").click(); }});
document.getElementById("btnSearchSfx").onclick = () => { if(!isNodeReady) return; const keyword = document.getElementById("sfxKeyword").value.trim(); if (!keyword) return; loadSFXData(keyword); };
setTimeout(() => { if(isNodeReady && !hasLoadedTrending) { hasLoadedTrending = true; loadSFXData("meme"); } }, 500);
}

// Official MyInstants API + discovery/favorites/history + GitHub Releases updater.
const MYINSTANTS_API = "https://www.myinstants.com/api/v1/instants/";
const GITHUB_REPOSITORY = "nthanhtinh2402/Myinstants-SFX";
const CATEGORY_PRESETS = ["meme", "funny", "games", "music", "anime", "movies", "reactions", "animals"];
const apiCache = new Map();
let searchState = { query: "meme", category: "meme", tag: "", sounds: [], next: null, scrollTop: 0 };
let searchHistory = [], historyIndex = -1, requestInFlight = false, latestRelease = null;
let favorites = loadFavorites();
let myInstantsRequestTimes = [];
const transparentDragImage = new Image();
transparentDragImage.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
function recordApiRequest(hasToken,url){
    const now=Date.now();myInstantsRequestTimes=myInstantsRequestTimes.filter(x=>now-x<60000);myInstantsRequestTimes.push(now);
    const day=new Date().toISOString().slice(0,10);let usage;try{usage=JSON.parse(localStorage.getItem("myInstantsApiUsage")||"null");}catch(_){usage=null;}
    if(!usage||usage.day!==day)usage={day,count:0};usage.count++;localStorage.setItem("myInstantsApiUsage",JSON.stringify(usage));
    const quota=hasToken?`${usage.count}/1500 today`:`${myInstantsRequestTimes.length}/10 this minute`;
    log(`[API ${hasToken?"token":"anonymous"}] ${quota}: ${new URL(url).search}`,"#3498db");
}

function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function officialRequest(url, retries = 2, extraHeaders = {}) {
    const isMyInstants = /^https:\/\/www\.myinstants\.com\//i.test(url);
    if (apiCache.has(url)) { if (isMyInstants) log(`[API cache] ${new URL(url).search}`, "#7f8c8d"); return Promise.resolve(apiCache.get(url)); }
    return new Promise((resolve, reject) => {
        const headers = Object.assign({"User-Agent":"MyInstants-SFX-CEP/1.4.1", "Accept":"application/json"}, extraHeaders);
        const token = localStorage.getItem("sfxApiToken");
        if (token && isMyInstants) headers.Authorization = /^Token |^Bearer /i.test(token) ? token : `Token ${token}`;
        if (isMyInstants) recordApiRequest(!!token,url);
        const req = https.get(url, {headers}, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                res.resume(); return officialRequest(new URL(res.headers.location, url).toString(), retries, extraHeaders).then(resolve, reject);
            }
            let body = ""; res.on("data", c => body += c);
            res.on("end", () => {
                if ((res.statusCode === 429 || res.statusCode >= 500) && retries > 0) {
                    if (isMyInstants) log(`[API] HTTP ${res.statusCode}; retrying (${retries} left)...`, "#f39c12");
                    return setTimeout(() => officialRequest(url, retries - 1, extraHeaders).then(resolve, reject), (3 - retries) * 900);
                }
                if (res.statusCode === 429) return reject(new Error("MyInstants rate limit reached. Add an API token in Settings or try again later."));
                if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
                try { const parsed = JSON.parse(body); apiCache.set(url, parsed); if(isMyInstants)log(`[API] HTTP 200 · ${(parsed.results||[]).length} results · ${parsed.next?"more pages":"last page"}`,"#00aa66"); resolve(parsed); } catch (_) { reject(new Error("Invalid JSON response")); }
            });
        });
        req.setTimeout(20000, () => req.destroy(new Error("Request timeout")));
        req.on("error", reject);
    });
}
function fetchBinary(url, redirects = 0) {
    return new Promise((resolve, reject) => {
        if (redirects > 8) return reject(new Error("Too many redirects"));
        https.get(url, {headers:{"User-Agent":"MyInstants-SFX-Updater/1.4.1","Accept":"*/*"}}, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                res.resume(); return fetchBinary(new URL(res.headers.location, url).toString(), redirects + 1).then(resolve, reject);
            }
            const chunks = []; res.on("data", c => chunks.push(c));
            res.on("end", () => res.statusCode === 200 ? resolve(Buffer.concat(chunks)) : reject(new Error(`HTTP ${res.statusCode}`)));
        }).on("error", reject);
    });
}
function normalizeSound(raw) {
    return { slug:String(raw.slug || raw.sound || raw.name), name:String(raw.name || "Untitled"), sound:String(raw.sound || ""),
        description:String(raw.description || ""), tags:String(raw.tags || ""), color:String(raw.color || ""), image:raw.image || null };
}
function loadFavorites() { try { const v = JSON.parse(localStorage.getItem("sfxFavorites") || "{}"); return v && typeof v === "object" ? v : {}; } catch (_) { return {}; } }
function saveFavorites() { localStorage.setItem("sfxFavorites", JSON.stringify(favorites)); }
function toggleFavorite(sound) { if (favorites[sound.slug]) delete favorites[sound.slug]; else favorites[sound.slug] = sound; saveFavorites(); renderSearchResults(); renderFavorites(); }

function snapshotState() {
    const box = document.getElementById("sfxResults");
    return JSON.parse(JSON.stringify(Object.assign({}, searchState, {scrollTop: box ? box.scrollTop : 0})));
}
function updateHistoryButtons() {
    document.getElementById("btnHistoryBack").disabled = historyIndex <= 0;
    document.getElementById("btnHistoryForward").disabled = historyIndex < 0 || historyIndex >= searchHistory.length - 1;
}
function pushHistory() {
    searchHistory = searchHistory.slice(0, historyIndex + 1); searchHistory.push(snapshotState());
    if (searchHistory.length > 20) searchHistory.shift(); historyIndex = searchHistory.length - 1; updateHistoryButtons();
}
function updateCurrentHistory() { if (historyIndex >= 0) searchHistory[historyIndex] = snapshotState(); }
function restoreHistory(index) {
    if (index < 0 || index >= searchHistory.length) return;
    historyIndex = index; searchState = JSON.parse(JSON.stringify(searchHistory[index]));
    renderCategoryChips(); renderTagChips(); renderSearchResults();
    requestAnimationFrame(() => document.getElementById("sfxResults").scrollTop = searchState.scrollTop || 0); updateHistoryButtons();
}

function renderCategoryChips() {
    document.getElementById("categoryChips").innerHTML = CATEGORY_PRESETS.map(c => `<button class="chip ${searchState.category === c ? "active" : ""}" data-category="${c}">${c[0].toUpperCase()+c.slice(1)}</button>`).join("");
}
function availableTags() {
    const counts = {};
    searchState.sounds.forEach(s => String(s.tags).split(/[\s,;#]+/).filter(x => x.length > 1).forEach(x => { const k=x.toLowerCase(); counts[k]=(counts[k]||0)+1; }));
    return Object.keys(counts).sort((a,b) => counts[b]-counts[a] || a.localeCompare(b)).slice(0, 15);
}
function renderTagChips() {
    const tags = availableTags();
    document.getElementById("tagChips").innerHTML = tags.length ? `<button class="chip ${!searchState.tag ? "active" : ""}" data-tag="">${t("allTags")}</button>` + tags.map(x => `<button class="chip ${searchState.tag===x?"active":""}" data-tag="${escapeHtml(x)}">#${escapeHtml(x)}</button>`).join("") : "";
}
function visibleSounds() { const tag=searchState.tag.toLowerCase(); return tag ? searchState.sounds.filter(s => String(s.tags).toLowerCase().split(/[\s,;#]+/).includes(tag)) : searchState.sounds; }

function soundCard(sound, index, context) {
    const fav = !!favorites[sound.slug], id = `${context}-${index}`;
    let bars=""; let hash=0; for(let j=0;j<sound.name.length;j++)hash+=sound.name.charCodeAt(j); for(let j=0;j<36;j++){const h=Math.round(Math.abs(Math.sin(hash+j*1.37))*65+25);bars+=`<span class="wave-bar" style="height:${h}%"></span>`;}
    return `<div class="sound-item" draggable="true" data-slug="${escapeHtml(sound.slug)}" data-context="${context}">
      <div class="play-btn" id="play-${id}" data-action="play" data-sound="${escapeHtml(sound.sound)}"><i class="fa-solid fa-play"></i></div>
      <div class="sound-info"><div class="sound-title" title="${escapeHtml(sound.description || sound.name)}">${escapeHtml(sound.name)}</div><div class="waveform-wrapper"><div class="waveform-container" data-wave>${bars}</div><div class="time-display" data-time>0:00</div></div><div style="font-size:9px;color:#777;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(sound.tags)}</div></div>
      <button class="star-btn ${fav?"active":""}" data-action="favorite" title="Favorite"><i class="fa-${fav?"solid":"regular"} fa-star"></i></button>
      <button class="btn-dl" data-action="import">Import</button></div>`;
}
function bindSoundCards(container, sounds, context) {
    Array.from(container.querySelectorAll(".sound-item")).forEach((item, i) => {
        const sound = sounds[i]; if (!sound) return;
        item.querySelector('[data-action="favorite"]').onclick = e => { e.stopPropagation(); toggleFavorite(sound); };
        item.querySelector('[data-action="play"]').onclick = () => playSound(sound, item);
        item.querySelector('[data-action="import"]').onclick = e => importSound(sound, e.currentTarget);
        item.ondragstart = e => prepareSoundDrag(e, sound);
    });
}
let activeAudio = null, activePlayButton = null, activeSoundItem = null;
function formatSoundTime(seconds){if(!isFinite(seconds))return "0:00";const m=Math.floor(seconds/60),s=Math.floor(seconds%60);return `${m}:${s<10?"0":""}${s}`;}
function resetSoundProgress(item){if(!item)return;Array.from(item.querySelectorAll("[data-wave] .wave-bar")).forEach(b=>b.style.background="#444");const time=item.querySelector("[data-time]");if(time)time.innerText="0:00";}
function playSound(sound, item) {
    const button = item.querySelector('[data-action="play"]');
    if (activeAudio && activePlayButton === button) { if (activeAudio.paused) { activeAudio.play(); button.innerHTML='<i class="fa-solid fa-pause"></i>'; } else { activeAudio.pause(); button.innerHTML='<i class="fa-solid fa-play"></i>'; } return; }
    if (activeAudio) activeAudio.pause(); if (activePlayButton) activePlayButton.innerHTML='<i class="fa-solid fa-play"></i>'; resetSoundProgress(activeSoundItem);
    activeAudio = new Audio(sound.sound); activePlayButton = button; activeSoundItem=item; button.innerHTML='<i class="fa-solid fa-pause"></i>'; activeAudio.play().catch(e => log(e.message,"#ff4444"));
    activeAudio.ontimeupdate=()=>{if(!activeAudio.duration)return;const bars=Array.from(item.querySelectorAll("[data-wave] .wave-bar")),active=Math.floor((activeAudio.currentTime/activeAudio.duration)*bars.length);bars.forEach((b,i)=>b.style.background=i<=active?"var(--primary)":"#444");const time=item.querySelector("[data-time]");if(time)time.innerText=formatSoundTime(activeAudio.currentTime);};
    activeAudio.onended = () => { button.innerHTML='<i class="fa-solid fa-play"></i>';resetSoundProgress(item);activePlayButton=null;activeSoundItem=null; };
}
function safeSoundName(sound) { return sound.name.replace(/[\\/:*?"<>|]/g, "").trim().slice(0, 150) + ".mp3"; }
async function downloadSound(sound) {
    const dir = await getDownloadDirectory("SFX"), target = path.join(dir, safeSoundName(sound));
    if (!fs.existsSync(target)) fs.writeFileSync(target, await fetchBinary(sound.sound)); return target;
}
async function importSound(sound, button) {
    const original=button.innerText; button.disabled=true; button.innerText="...";
    try { const target=await downloadSound(sound); importFileToPremiere(target,"MyInstants SFX",30); button.innerText="Done!"; }
    catch(e) { log(`SFX: ${e.message}`,"#ff4444"); button.innerText="Error"; }
    setTimeout(() => { button.innerText=original; button.disabled=false; },1500);
}
function prepareSoundDrag(e, sound) {
    if(e.dataTransfer&&e.dataTransfer.setDragImage)e.dataTransfer.setDragImage(transparentDragImage,0,0);
    const target = path.join(globalSfxDir || os.tmpdir(), safeSoundName(sound));
    if (!fs.existsSync(target)) { e.preventDefault(); downloadSound(sound).then(() => log("Sound ready. Drag it again.","#f39c12")); return; }
    e.dataTransfer.setData("com.adobe.cep.dnd.file.0", target); e.dataTransfer.effectAllowed="copy";
}
function renderSearchResults() {
    const box=document.getElementById("sfxResults"), sounds=visibleSounds();
    box.innerHTML = sounds.length ? sounds.map((s,i)=>soundCard(s,i,"search")).join("") : '<div style="text-align:center;padding:20px;color:#888">No SFX found.</div>';
    bindSoundCards(box,sounds,"search"); renderTagChips();
}
function renderFavorites() {
    const box=document.getElementById("favoriteResults"); if(!box)return; const sounds=Object.keys(favorites).map(k=>favorites[k]);
    box.innerHTML=sounds.length?sounds.map((s,i)=>soundCard(s,i,"favorite")).join(""):`<div style="text-align:center;padding:20px;color:#888">${t("noFavorites")}</div>`;
    bindSoundCards(box,sounds,"favorite");
}
async function runSearch(query, category="", addHistory=true) {
    query=String(query||"").trim(); if(!query || requestInFlight)return; requestInFlight=true;
    const box=document.getElementById("sfxResults"); box.innerHTML=`<div style="text-align:center;padding:20px;color:var(--primary)">${t("loadingSfx")}</div>`;
    try {
        const url=`${MYINSTANTS_API}?format=json&name=${encodeURIComponent(query)}&page=1`, data=await officialRequest(url);
        searchState={query,category,tag:"",sounds:(data.results||[]).map(normalizeSound),next:data.next||null,scrollTop:0};
        renderCategoryChips(); renderSearchResults(); if(addHistory)pushHistory();
    } catch(e) { box.innerHTML=`<div style="color:#ff5555;text-align:center;padding:20px">${escapeHtml(e.message)}</div>`; log(e.message,"#ff4444"); }
    finally { requestInFlight=false; }
}
async function loadNextPage() {
    if(requestInFlight||!searchState.next)return; requestInFlight=true;
    try { const data=await officialRequest(searchState.next); const known=new Set(searchState.sounds.map(s=>s.slug)); (data.results||[]).map(normalizeSound).forEach(s=>{if(!known.has(s.slug))searchState.sounds.push(s);}); searchState.next=data.next||null; renderSearchResults(); updateCurrentHistory(); }
    catch(e){log(e.message,"#ff4444");} finally{requestInFlight=false;}
}

document.getElementById("categoryChips").onclick=e=>{const b=e.target.closest("[data-category]");if(b)runSearch(b.dataset.category,b.dataset.category);};
document.getElementById("tagChips").onclick=e=>{const b=e.target.closest("[data-tag]");if(b){searchState.tag=b.dataset.tag;renderSearchResults();updateCurrentHistory();}};
document.getElementById("btnHistoryBack").onclick=()=>restoreHistory(historyIndex-1);
document.getElementById("btnHistoryForward").onclick=()=>restoreHistory(historyIndex+1);
document.getElementById("btnSearchSfx").onclick=()=>runSearch(document.getElementById("sfxKeyword").value,"custom");
document.getElementById("sfxKeyword").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();document.getElementById("btnSearchSfx").click();}};
document.getElementById("sfxResults").onscroll=function(){searchState.scrollTop=this.scrollTop;updateCurrentHistory();if(this.scrollTop+this.clientHeight>=this.scrollHeight-60)loadNextPage();};

function compareSemver(a,b){const x=String(a).replace(/^v/,"").split(/[.-]/),y=String(b).replace(/^v/,"").split(/[.-]/);for(let i=0;i<Math.max(x.length,y.length);i++){const d=(parseInt(x[i],10)||0)-(parseInt(y[i],10)||0);if(d)return d;}return 0;}
function extensionRootPathNew(){let r=csInterface.getSystemPath(SystemPath.EXTENSION);if(r.indexOf("file:///")===0)r=r.substring(8);else if(r.indexOf("file:\\")===0)r=r.substring(6);return decodeURI(r);}
function extensionVersionNew(){const xml=fs.readFileSync(path.join(extensionRootPathNew(),"CSXS","manifest.xml"),"utf8"),m=xml.match(/ExtensionBundleVersion="([^"]+)"/);return m?m[1]:"0.0.0";}
function setUpdateUi(message,color){const e=document.getElementById("updateStatus");e.innerText=message;e.style.color=color||"#aaa";}
async function checkGitHubRelease(silent=false){
    if(GITHUB_REPOSITORY.indexOf("REPLACE_")===0){setUpdateUi("Set GITHUB_REPOSITORY in js/main.js after publishing the repo.","#f39c12");return null;}
    try{const data=await officialRequest(`https://api.github.com/repos/${GITHUB_REPOSITORY}/releases/latest`,1,{"Accept":"application/vnd.github+json"});const version=String(data.tag_name||data.name||"").replace(/^v/,"");
        if(!version)throw new Error("Latest release has no version tag");latestRelease={data,version};
        if(compareSemver(version,extensionVersionNew())>0){setUpdateUi(`Version ${version} is available.`,"#00ccff");document.getElementById("btnCheckUpdate").innerText=`Update v${version}`;document.getElementById("updateBadge").style.display="inline";}
        else{setUpdateUi(`You have the latest version (${extensionVersionNew()}).`,"#00cc66");document.getElementById("updateBadge").style.display="none";}return latestRelease;
    }catch(e){const message=e.message==="HTTP 404"?"GitHub repository is connected, but it has no published release yet.":`Update check failed: ${e.message}`;setUpdateUi(message,e.message==="HTTP 404"?"#f39c12":"#ff4444");if(!silent)log(message,e.message==="HTTP 404"?"#f39c12":"#ff4444");return null;}
}
function quotePs(v){return "'"+String(v).replace(/'/g,"''")+"'";}
async function installRelease(release){
    const version=release.version,base=`MyInstants-SFX-v${version}.zip`,assets=release.data.assets||[],zipAsset=assets.find(a=>a.name===base),sumAsset=assets.find(a=>a.name===base+".sha256");
    if(!zipAsset||!sumAsset)throw new Error(`Release must contain ${base} and ${base}.sha256`);
    setUpdateUi(`Downloading v${version}...`,"#f39c12");const zip=await fetchBinary(zipAsset.browser_download_url),sum=String(await fetchBinary(sumAsset.browser_download_url)).trim().split(/\s+/)[0].toLowerCase();
    const actual=crypto.createHash("sha256").update(zip).digest("hex");if(!/^[a-f0-9]{64}$/.test(sum)||sum!==actual)throw new Error("SHA-256 checksum mismatch");
    const tmp=path.join(os.tmpdir(),`MyInstants-SFX-update-${Date.now()}`),zipPath=path.join(tmp,base),stage=path.join(tmp,"stage"),root=extensionRootPathNew(),backup=root+`.backup-${Date.now()}`;fs.mkdirSync(tmp,{recursive:true});fs.writeFileSync(zipPath,zip);
    if(os.platform()==="win32") cp.execFileSync("powershell.exe",["-NoProfile","-Command",`Expand-Archive -LiteralPath ${quotePs(zipPath)} -DestinationPath ${quotePs(stage)} -Force`]);
    else if(os.platform()==="darwin") cp.execFileSync("/usr/bin/unzip",["-oq",zipPath,"-d",stage]);
    const stagedManifest=path.join(stage,"CSXS","manifest.xml");if(!fs.existsSync(stagedManifest))throw new Error("Invalid package: CSXS/manifest.xml is missing");
    const stagedXml=fs.readFileSync(stagedManifest,"utf8"),stagedVersion=(stagedXml.match(/ExtensionBundleVersion="([^"]+)"/)||[])[1];if(stagedVersion!==version)throw new Error(`Package version ${stagedVersion||"unknown"} does not match release ${version}`);
    const logPath=path.join(tmp,"install.log");
    if(os.platform()==="win32"){
        const script=path.join(tmp,"install.ps1");
        fs.writeFileSync(script,["$ErrorActionPreference='Stop'","Start-Sleep -Seconds 2",`$stage=${quotePs(stage)}`,`$target=${quotePs(root)}`,`$backup=${quotePs(backup)}`,`$log=${quotePs(logPath)}`,"Copy-Item -LiteralPath $target -Destination $backup -Recurse -Force","try { Copy-Item -Path (Join-Path $stage '*') -Destination $target -Recurse -Force; Add-Content $log 'Update complete' } catch { Copy-Item -Path (Join-Path $backup '*') -Destination $target -Recurse -Force; Add-Content $log $_; throw }","Add-Type -AssemblyName PresentationFramework","[System.Windows.MessageBox]::Show('Update installed. Restart Premiere Pro.','MyInstants SFX')|Out-Null"].join("\r\n"),"utf8");
        cp.spawn("powershell.exe",["-NoProfile","-Command",`Start-Process powershell.exe -Verb RunAs -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',${quotePs(script)})`],{detached:true,stdio:"ignore"}).unref();
    }else if(os.platform()==="darwin"){
        const script=path.join(tmp,"install.sh");
        const shq=v=>"'"+String(v).replace(/'/g,"'\\''")+"'";
        fs.writeFileSync(script,`#!/bin/bash\nset -e\nsleep 2\ncp -R ${shq(root)} ${shq(backup)}\ncp -R ${shq(stage+path.sep+".")} ${shq(root)}\necho 'Update complete' > ${shq(logPath)}\n`,"utf8");fs.chmodSync(script,0o755);
        const command=`do shell script ${JSON.stringify(`/bin/bash ${shq(script)}`)} with administrator privileges`;cp.spawn("osascript",["-e",command],{detached:true,stdio:"ignore"}).unref();
    }else throw new Error("Unsupported operating system");
    setUpdateUi(`Installer started. Log: ${logPath}`,"#3498db");
}
document.getElementById("btnCheckUpdate").onclick=async()=>{const b=document.getElementById("btnCheckUpdate");b.disabled=true;try{const r=latestRelease||await checkGitHubRelease(false);if(r&&compareSemver(r.version,extensionVersionNew())>0)await installRelease(r);}catch(e){setUpdateUi(`Update failed: ${e.message}`,"#ff4444");log(e.message,"#ff4444");}finally{b.disabled=false;}};

renderCategoryChips();renderFavorites();setTimeout(()=>{if(isNodeReady){runSearch("meme","meme");checkGitHubRelease(true);}},400);
