console.log("Running script_slow.js")

const audios = []
const playbackRate = 0.8
const filtered_out_chapters = get_filtered_out_chapters()
const unfiltered_obj_tracks = get_obj_tracks()
const obj_tracks = applyfiter(unfiltered_obj_tracks, filtered_out_chapters) 
const STATUS = {
    "BXXX": "B001",
    "CXXX": "C000",
    "SXXX": "S000",
}

update_title()

function truncateString(str) {
    const max_length = 28
    str = str.trim().replace(".", "").replace(":", "").trim()
    str = str.replace("ðə 101 móʊst ᵻ̀mpɔ́rtənt kɒ́nsɛpts əv ", "")
    str = str.replace("ðə 101 móʊst ᵻ́ntərəstᵻŋ kɒ́nsɛpts əv ", "")
    str = str.replace("The 101 most important concepts of ", "")
    str = str.replace("The 101 Most Interesting Concepts of ", "")
    if (str.length <= max_length) {
        return str;
    }

    str = str.replace(/\([^)]*\)/g, '');
    if (str.length > max_length) {
        str = str.substring(0, max_length - 4).trim() + '...';
    } else {
        str = str.trim().replace(".", "").replace(":", "").trim()
    }
    
    return str;
}

document.querySelector("#text_mode").addEventListener("click", function () {
    if (this.innerHTML === "a") {
        this.innerHTML = "æ";
        document.querySelector("#book_bʊ́k").innerHTML = "bʊ́k:"
        document.querySelector("#chapter_ʧǽptər").innerHTML = "ʧǽptər:"
        document.querySelector("#kindle").innerHTML = "báɪ kᵻ́ndəl"
        update_title()
    } else {
        this.innerHTML = "a";
        document.querySelector("#book_bʊ́k").innerHTML = "Book:"
        document.querySelector("#chapter_ʧǽptər").innerHTML = "Chapter:"
        document.querySelector("#kindle").innerHTML = "Buy Kindle"
        update_title()
    }
})

document.querySelector("#operation_mode").addEventListener("click", function () {
    if (isRepeat()) {
        this.innerHTML = icon_no_repeat;
    } else {
        this.innerHTML = icon_si_repeat;
    }
})

document.querySelector("#sound").addEventListener("click", function () {
    if (isMuted()) {
        this.innerHTML = icon_si_sound;
        play()
    } else {
        this.innerHTML = icon_no_sound;
        pause_play()
    }
})

document.querySelector("#max_min").addEventListener("click", function () {
    if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
})

document.addEventListener("fullscreenchange", function () {
    if (document.fullscreenElement) {
      document.querySelector("#max_min").innerHTML = icon_exit_fullscreen
    } else {
      document.querySelector("#max_min").innerHTML = icon_enter_fullscreen
    }
});

function get_text_tran(){
    if (document.querySelector("#text_mode").innerHTML === "a"){
        return "text"
    } else {
        return "tran"
    }
}

function isRepeat(){
    const icon_repeat = document.querySelector("#operation_mode").innerHTML
    const distance_to_si = distance(icon_repeat, icon_si_repeat)
    const distance_to_no = distance(icon_repeat, icon_no_repeat)
    return distance_to_si < distance_to_no
}

function isMuted(){
    const icon_sound = document.querySelector("#sound").innerHTML
    const distance_to_si = distance(icon_sound, icon_si_sound)
    const distance_to_no = distance(icon_sound, icon_no_sound)
    return distance_to_si > distance_to_no
}

function openInNewTab(url) {
    let newTab = document.createElement('a');
    newTab.href = url;
    newTab.target = "_blank";
    newTab.click();
}

function get_filtered_out_chapters(){
    const url = "./filters/filters.txt"
    const filters_text = get_text(url)
    return filters_text.split("\n").filter(line => {
        return line.slice(0, 3) === "[x]"
    }).reduce((acc, line) => {
        const BXXXCXXX = line.slice(4, 12)
        acc[BXXXCXXX] = line
        return acc
    }, {})
}

function get_filters(){
    const url = "./filters/filters.txt"
    const filters_text = get_text(url)
    return filters_text.split("\n").filter(line => {
        return line.slice(0, 3) === "[o]"
    }).reduce((acc, line) => {
        const BXXXCXXX = line.slice(4, 12)
        acc[BXXXCXXX] = line
        return acc
    }, {})
}

function get_books(TEXTS_TRANS){
    const books = {}
    const folder = TEXTS_TRANS === "TEXTS"
        ? "text"
        : "transcriptions"
    const urls = [
        `./${folder}/books/B001/B001_${TEXTS_TRANS}_ALL.txt`,
        `./${folder}/books/B002/B002_${TEXTS_TRANS}_ALL.txt`,
        `./${folder}/books/B009/B009_${TEXTS_TRANS}_ALL.txt`,
    ]
    for (const url of urls){
        const text = get_text(url)
        const lines = text.trim().split("\n")
        let BXXX = ""
        let CXXX = ""
        let SXXX = ""
        let iSXXX = 0
        const regex = /^B\d{3}C\d{3}$/;
        for (let line of lines){
            if (line.trim() !== ""){
                if (regex.test(line.slice(0, 8))){
                    BXXX = line.slice(0, 4)
                    CXXX = line.slice(4, 8)
                    iSXXX = 0
                    line = line.replace(BXXX + CXXX + "SXXX.txt: ", "")
                    line = line.replace(BXXX + CXXX + ": ", "")
                } else {
                    iSXXX += 1
                }    
                SXXX = "S" + iSXXX.toString().padStart(3, '0')
                if (books[BXXX] === undefined) {
                    books[BXXX] = {}
                }
                if (books[BXXX][CXXX] === undefined) {
                    books[BXXX][CXXX] = {}
                }
                books[BXXX][CXXX][SXXX] = line
            }
        }
    }
    return books
}

function applyfiter(tracks, filtered_out_chapters){
    const filtered_tracks = {}
    const BXXXs = Object.keys(tracks)
    for (const BXXX of BXXXs){
        filtered_tracks[BXXX] = {}
        const CXXXs = Object.keys(tracks[BXXX])
        for (const CXXX of CXXXs){
            if (filtered_out_chapters[BXXX + CXXX] === undefined){
                filtered_tracks[BXXX][CXXX] = tracks[BXXX][CXXX]
            }
        }
    }
    return filtered_tracks
}

function get_obj_tracks(){
    const obj_tracks = {}
    const obj_books_texts = get_books("TEXTS")
    const obj_books_trans = get_books("TRANS")
    for (const BXXX in obj_books_trans){
        obj_tracks[BXXX] = {}
        for (const CXXX in obj_books_trans[BXXX]){
            obj_tracks[BXXX][CXXX] = {}
            for (const SXXX in obj_books_trans[BXXX][CXXX]){
                obj_tracks[BXXX][CXXX][SXXX] = {
                    "code": BXXX + CXXX + SXXX,
                    "text": obj_books_texts[BXXX][CXXX][SXXX],
                    "tran": obj_books_trans[BXXX][CXXX][SXXX],
                    "audio": `./audio/books/${BXXX}/${BXXX}${CXXX}${SXXX}_echo.mp3`,
                }
            }
        }
    }
    return obj_tracks
}

function distance(str1, str2) {
    //levenshteinDistance
    str1 = String(str1)
    str2 = String(str2)
    const m = str1.length;
    const n = str2.length;
    const d = new Array(m + 1);
    for (let i = 0; i <= m; i++) {
        d[i] = new Array(n + 1);
        d[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        d[0][j] = j;
    }
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    return d[m][n];
}

function* enumerate(iterable) {
    let index = 0;
    for (const item of iterable) {
      yield [index, item];
      index++;
    }
}

function get_text(url){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    text = xhr.responseText;
    return text
}

function addOneToNumber(numStr) {
    let num = parseInt(numStr);
    num++;
    if (num < 10) {
        return '0' + num;
    } else {
        return num.toString();
    }
}

function update_title() {
    const text_tran = get_text_tran()
    const {BXXX, CXXX, SXXX} = STATUS
    const book_title = truncateString(obj_tracks[BXXX]["C000"]["S000"][text_tran])
    const chapter_title =   truncateString(obj_tracks[BXXX][CXXX]["S000"][text_tran])
    const text = obj_tracks[BXXX][CXXX][SXXX][text_tran]
    document.querySelector("#book_title").innerHTML = book_title
    document.querySelector("#chapter_title").innerHTML = chapter_title
    document.querySelector("#sentence_number").innerHTML = addOneToNumber(SXXX.slice(2, 4))
    document.querySelector("#sentence_total_number").innerHTML = Object.keys(obj_tracks[BXXX][CXXX]).length
    document.querySelector("#text").innerHTML = `${text}`
    if (CXXX === "C000"){
        if (text_tran === "text") {
            document.querySelector("#chapter_title").innerHTML = "Introduction"
        } else {
            document.querySelector("#chapter_title").innerHTML = "ᵻ̀ntrədʌ́kʃən"
        }
    }
}

function play(){
    update_title();
    if (!isMuted()) {
        const audioFileFullPath = obj_tracks[STATUS.BXXX][STATUS.CXXX][STATUS.SXXX]["audio"];
        const audio = new Audio(audioFileFullPath);
        audio.playbackRate = playbackRate;
        audios.map(audio => {
            audio.pause();
        })
        audio.play()
        audios.push(audio)
        audio.addEventListener("ended", function () {
            setTimeout(function () {
                if (!isRepeat()){
                    next_track()
                }
                play()
            }, 600)
        })        
    }
}

function pause_play() {
    document.querySelector("#sound").innerHTML = icon_no_sound
    audios.map(audio => {
        audio.pause();
    })
}

function book_up(){
    const books = Object.keys(obj_tracks)
    const iBXXX = books.indexOf(STATUS["BXXX"])
    STATUS["BXXX"] = iBXXX < books.length - 1
        ? books[iBXXX + 1]
        : books[iBXXX]
    update_title()
    play()
}

function book_down(){
    const books = Object.keys(obj_tracks)
    const iBXXX = books.indexOf(STATUS["BXXX"])
    STATUS["BXXX"] = iBXXX > 0
        ? books[iBXXX - 1]
        : books[iBXXX]
    update_title()
    play()
}

function chapter_up(){
    const chapters = Object.keys(obj_tracks[STATUS["BXXX"]])
    const iCXXX = chapters.indexOf(STATUS["CXXX"])
    STATUS["CXXX"] = iCXXX < chapters.length + 1
        ? chapters[iCXXX + 1]
        : chapters[iCXXX]
    update_title()
    play()
}

function chapter_down(){
    const chapters = Object.keys(obj_tracks[STATUS["BXXX"]])
    const iCXXX = chapters.indexOf(STATUS["CXXX"])
    STATUS["CXXX"] = iCXXX > 0
        ? chapters[iCXXX - 1]
        : chapters[iCXXX]
    update_title()
    play()
}

function sentence_up() {
    const sentences = Object.keys(obj_tracks[STATUS["BXXX"]][STATUS["CXXX"]])
    const iSXXX = sentences.indexOf(STATUS["SXXX"])
    STATUS["SXXX"] = iSXXX < sentences.length - 1
        ? sentences[iSXXX + 1]
        : sentences[iSXXX]
    update_title()
    play()
}

function sentence_down(){
    const sentences = Object.keys(obj_tracks[STATUS["BXXX"]][STATUS["CXXX"]])
    const iSXXX = sentences.indexOf(STATUS["SXXX"])
    STATUS["SXXX"] = iSXXX > 0
        ? sentences[iSXXX - 1]
        : sentences[iSXXX]
    update_title()
    play()
}

function next_track(){
    const books = Object.keys(obj_tracks)
    const chapters = Object.keys(obj_tracks[STATUS["BXXX"]])
    const sentences = Object.keys(obj_tracks[STATUS["BXXX"]][STATUS["CXXX"]])

    const iBXXX = books.indexOf(STATUS["BXXX"])
    const iCXXX = chapters.indexOf(STATUS["CXXX"])
    const iSXXX = sentences.indexOf(STATUS["SXXX"])

    isLastSentence = iSXXX >= sentences.length - 1
    isLastChapter = iCXXX >= chapters.length - 1
    isLastBook = iBXXX >= books.length - 1 

    if (!isLastSentence) {
        STATUS["SXXX"] = sentences[iSXXX + 1]
    } else if (!isLastChapter) {
        STATUS["CXXX"] = chapters[iCXXX + 1]
        STATUS["SXXX"] = "S000"
    } else if (!isLastBook) {
        STATUS["BXXX"] = books[iBXXX + 1]
        STATUS["CXXX"] = "C000"
        STATUS["SXXX"] = "S000"
    } else {
        STATUS["BXXX"] = "B001"
        STATUS["CXXX"] = "C000"
        STATUS["SXXX"] = "S000"
    }
    
    update_title()
    play()
}

document.querySelector("#text-row").addEventListener("click", function () {
    next_track()
})

window.addEventListener('resize', () => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    for (const id of ["top", "book", "chapter", "sentence"]){
        if (screenWidth > screenHeight * 1.6  && window.screen.width < 768) {
            document.querySelector(`#${id}-row`).style.display = 'none'; 
        } else {
            document.querySelector(`#${id}-row`).style.display = 'flex';
        }
    }
});

document.querySelector("#book_up").addEventListener("click", book_up)
document.querySelector("#book_down").addEventListener("click", book_down)
document.querySelector("#chapter_up").addEventListener("click", chapter_up)
document.querySelector("#chapter_down").addEventListener("click", chapter_down)
document.querySelector("#sentence_up").addEventListener("click", sentence_up)
document.querySelector("#sentence_down").addEventListener("click", sentence_down)

document.querySelector("#kindle").addEventListener("click", function () {
    const url = "https://www.amazon.co.uk/brief-history-Artificial-Intelligence-ebook/dp/B0C5DWF7LL/ref=sr_1_3?crid=JZR2GY582PLP&dib=eyJ2IjoiMSJ9.JnBwUikzDVNNbEBB3gsQGVjRNSPLyT3gYzaAVz44pMZkinZ2mpvIvTDbTUKt9ivXrs5HR4ckDZpTCX1nC9R06LN5_NIUbWEeNuYFwLwgLoDSLHiCNc5Taowts64SYdidzUzgagp5r7FpcDgTGH_r3LUhYqZEFh9ZRFjASlfAOqW30o0jdtelu9-22fMh9u5zon1m3MFhXafZ_JsirOTh5Y4czrNsONOzbnLKSJulIFI.nFU77SXnHOo00pTQW5pVrVxoCGclOMu0-I1M0x3GWf4&dib_tag=se&keywords=kindle+a+brief+history+of+artificial+intelligence&qid=1717773263&sprefix=kindle+a+brief+history+of+artificial+intelligence%2Caps%2C91&sr=8-3"
    openInNewTab(url)
})

function deleteElementAndChildren(elementId) {
    const parent = document.getElementById(elementId);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    parent.remove()
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();        
        next_track();
    }
});

document.querySelector("#book").addEventListener("click", function (){
    // pause_play()

    if (document.querySelector("#list") !== null) {
        deleteElementAndChildren("list")
        document.querySelector("#chapter-row").style.display = "flex"
        document.querySelector("#sentence-row").style.display = "flex"
        document.querySelector("#text-row").style.display = "flex"
        document.querySelector("#book_down").style.display = "flex"
        document.querySelector("#book_up").style.display = "flex"
        document.querySelector("#book > .title").style.display = "flex"
        document.querySelector("#sound").innerHTML = icon_si_sound
        update_title()
        play()  
        return
    }

    document.querySelector("#chapter-row").style.display = "none"
    document.querySelector("#sentence-row").style.display = "none"
    document.querySelector("#text-row").style.display = "none"
    document.querySelector("#book_down").style.display = "none"
    document.querySelector("#book_up").style.display = "none"
    document.querySelector("#book > .title").style.display = "none"

    const div = document.createElement("div");
    div.id = "list"
    div.className = "column list";
    document.querySelector("#app").appendChild(div);

    document.querySelector("#book_title").innerHTML = "Choose a Book:"//"ʧúz ə bʊ́k:"
    const BXXXs = Object.keys(obj_tracks)
    for (const BXXX of BXXXs){
        const div = document.createElement("div");
        div.className = "row list-element";
        div.innerHTML = truncateString(obj_tracks[BXXX]["C000"]["S000"][get_text_tran()])
        div.addEventListener("click", function() {
            STATUS.BXXX = BXXX
            STATUS.CXXX = "C000"
            STATUS.SXXX = "S000"
            deleteElementAndChildren("list")
            document.querySelector("#chapter-row").style.display = "flex"
            document.querySelector("#sentence-row").style.display = "flex"
            document.querySelector("#text-row").style.display = "flex"
            document.querySelector("#book_down").style.display = "flex"
            document.querySelector("#book_up").style.display = "flex"
            document.querySelector("#book > .title").style.display = "flex"
            document.querySelector("#sound").innerHTML = icon_si_sound
            update_title()
            play()        
        });
        document.querySelector("#list").appendChild(div);
    }
})

document.querySelector("#chapter").addEventListener("click", function (){
    // pause_play()

    if (document.querySelector("#list") !== null) {
        deleteElementAndChildren("list")
        document.querySelector("#chapter-row").style.display = "flex"
        document.querySelector("#sentence-row").style.display = "flex"
        document.querySelector("#text-row").style.display = "flex"
        document.querySelector("#chapter_down").style.display = "flex"
        document.querySelector("#chapter_up").style.display = "flex"
        document.querySelector("#chapter > .title").style.display = "flex"
        document.querySelector("#sound").innerHTML = icon_si_sound
        update_title()
        play()  
        return
    }

    document.querySelector("#sentence-row").style.display = "none"
    document.querySelector("#text-row").style.display = "none"
    document.querySelector("#chapter_down").style.display = "none"
    document.querySelector("#chapter_up").style.display = "none"
    document.querySelector("#chapter > .title").style.display = "none"

    const div = document.createElement("div");
    div.id = "list"
    div.className = "column list";
    document.querySelector("#app").appendChild(div);

    document.querySelector("#chapter_title").innerHTML = "Choose a Chapter:"//"ʧúz ə ʧǽptər:"
    const CXXXs = Object.keys(obj_tracks[STATUS.BXXX])
    for (const CXXX of CXXXs){ 
        const div = document.createElement("div");
        div.className = "row list-element";
        if (CXXX !== "C000"){
           div.innerHTML = truncateString(obj_tracks[STATUS.BXXX][CXXX]["S000"][get_text_tran()]) 
        } else if (get_text_tran() === "text") {
            div.innerHTML = "Introduction"
        } else {
            div.innerHTML = "ᵻ̀ntrədʌ́kʃən"
        }
        
        div.addEventListener("click", function(){
            STATUS.CXXX = CXXX
            STATUS.SXXX = "S000"
            deleteElementAndChildren("list")
            document.querySelector("#sentence-row").style.display = "flex"
            document.querySelector("#text-row").style.display = "flex"
            document.querySelector("#sound").innerHTML = icon_si_sound
            document.querySelector("#chapter_down").style.display = "flex"
            document.querySelector("#chapter_up").style.display = "flex"
            document.querySelector("#chapter > .title").style.display = "flex"
            update_title()
            play()        
        });
        document.querySelector("#list").appendChild(div);
    }
})

function displayBookChapterRow(){

}