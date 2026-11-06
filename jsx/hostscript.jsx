function getProjectPath() {
    if (app.project && app.project.path) return app.project.path;
    return "";
}

function importToPremiere(filePath, binName, autoInsertStr) {
    try {
        if (!app.project) return "Lỗi: Không tìm thấy Project.";
        var project = app.project;
        var root = project.rootItem;
        var targetBin = null;

        for (var i = 0; i < root.children.numItems; i++) {
            if (root.children[i].type == 2 && root.children[i].name === binName) {
                targetBin = root.children[i]; break;
            }
        }
        if (!targetBin) targetBin = root.createBin(binName);

        var imported = project.importFiles([filePath], true, targetBin, false);

        if (autoInsertStr === "true" && imported) {
            var fileName = filePath.replace(/^.*[\\\/]/, ''); 
            var importedItem = null;

            for (var j = 0; j < targetBin.children.numItems; j++) {
                if (targetBin.children[j].name === fileName || targetBin.children[j].name.indexOf(fileName.split('.')[0]) !== -1) {
                    importedItem = targetBin.children[j]; break;
                }
            }
            if (importedItem) {
                var res = insertToSafestTrack(importedItem);
                return "SUCCESS_INSERTED: " + res;
            }
        }
        return "SUCCESS";
    } catch (e) {
        return "Lỗi Kịch Bản: " + e.toString();
    }
}

function insertToSafestTrack(projectItem) {
    try {
        var seq = app.project.activeSequence;
        if (!seq) return "No active sequence";

        var time = seq.getPlayerPosition();
        var playheadSec = parseFloat(time.seconds); 
        
        var itemName = projectItem.name.toLowerCase();
        var isAudioOnly = (itemName.indexOf('.mp3') !== -1 || itemName.indexOf('.wav') !== -1 || itemName.indexOf('.aac') !== -1 || itemName.indexOf('.m4a') !== -1);
        var isVideoOrImage = (itemName.indexOf('.mp4') !== -1 || itemName.indexOf('.mov') !== -1 || itemName.indexOf('.avi') !== -1 || itemName.indexOf('.webm') !== -1 || itemName.indexOf('.mkv') !== -1);

        if (!isAudioOnly && !isVideoOrImage) return "Not a supported media type";

        // =====================================
        // XỬ LÝ ÂM THANH: QUÉT TỪNG TRACK, CÒN TRỐNG THÌ THẢ, HẾT THÌ BẮT BUỘC ĐẺ TRACK
        // =====================================
        if (isAudioOnly) {
            var numTracks = seq.audioTracks.numTracks;
            var targetTrack = null;
            var targetIndex = -1;

            for (var i = 0; i < numTracks; i++) {
                var track = seq.audioTracks[i];
                if (track.isLocked()) continue;

                var hasConflict = false;
                var clipsCount = track.clips.numItems;
                
                for (var c = 0; c < clipsCount; c++) {
                    var clipEnd = parseFloat(track.clips[c].end.seconds);
                    // Nếu có bất kỳ clip nào kết thúc sau vạch playhead -> track này bị chiếm
                    if (clipEnd > playheadSec) {
                        hasConflict = true;
                        break;
                    }
                }

                if (!hasConflict) {
                    targetTrack = track;
                    targetIndex = i;
                    break;
                }
            }

            // Nếu tìm được track trống hoàn toàn
            if (targetTrack) {
                targetTrack.overwriteClip(projectItem, time);
                return "Audio Track " + (targetIndex + 1);
            } else {
                // BẮT BUỘC TẠO TRACK MỚI KHI TẤT CẢ CÁC TRACK ĐÃ KÍN
                app.enableQE();
                var qeSeq = qe.project.getActiveSequence();
                if (qeSeq) {
                    qeSeq.addTracks(0, 1, 0); // Thêm 1 Audio Track mới
                }
                
                // Chờ và làm mới sequence
                $.sleep(150);
                var freshSeq = app.project.activeSequence;
                var newTrackIndex = freshSeq.audioTracks.numTracks - 1;
                freshSeq.audioTracks[newTrackIndex].overwriteClip(projectItem, time);
                return "Tạo mới Audio Track " + (newTrackIndex + 1);
            }
        } 
        // =====================================
        // XỬ LÝ VIDEO
        // =====================================
        else if (isVideoOrImage) {
            var numVTracks = seq.videoTracks.numTracks;
            var targetVTrack = null;
            var targetVIndex = -1;

            for (var k = 0; k < numVTracks; k++) {
                var vTrack = seq.videoTracks[k];
                if (vTrack.isLocked()) continue;

                var hasVConflict = false;
                var vClipsCount = vTrack.clips.numItems;
                
                for (var vc = 0; vc < vClipsCount; vc++) {
                    var vClipEnd = parseFloat(vTrack.clips[vc].end.seconds);
                    if (vClipEnd > playheadSec) {
                        hasVConflict = true;
                        break;
                    }
                }

                if (!hasVConflict) {
                    targetVTrack = vTrack;
                    targetVIndex = k;
                    break;
                }
            }

            if (targetVTrack) {
                targetVTrack.overwriteClip(projectItem, time);
                return "Video Track " + (targetVIndex + 1);
            } else {
                app.enableQE();
                var qeSeqV = qe.project.getActiveSequence();
                if (qeSeqV) {
                    qeSeqV.addTracks(1, 0, 0); // Thêm 1 Video Track mới
                }
                
                $.sleep(150);
                var freshSeqV = app.project.activeSequence;
                var newVTrackIndex = freshSeqV.videoTracks.numTracks - 1;
                freshSeqV.videoTracks[newVTrackIndex].overwriteClip(projectItem, time);
                return "Tạo mới Video Track " + (newVTrackIndex + 1);
            }
        }
    } catch (err) {
        return "Lỗi Track: " + err.toString();
    }
}