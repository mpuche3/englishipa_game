console.log("Running script_slow.js")

const STATE = {
    BXXX: "B001",
    CXXX: "C000",
    SXXX: "S000",
    _isPhonetic: false,
    _isRepeat: false,    
    _isSoftMuted: false,
    _isHardMuted: true,

    get isPhonetic(){
        return this._isPhonetic
    },

    set isPhonetic(value){
        this._isPhonetic = !!value
        this.refresh_text()
    },

    get isRepeat(){
        return this._isRepeat
    },

    set isRepeat(value){
        this._isRepeat = !!value
        this.refresh_repeat()
    },

    get isSoftMuted(){
        return this._isSoftMuted
    },

    set isSoftMuted(value){
        this._isSoftMuted = !!value
        this.refresh_SoftMuted()
    },

    get isHardMuted(){
        return this._isHardMuted
    },

    set isHardMuted(value){
        this._isHardMuted = !!value
        this.refresh_HardMuted()
    },

    get_mode_text(){
        if (this._isPhonetic) {
            return "tran"
        } else {
            return "text"
        }
    },

    refresh_text() {
        if (this._isPhonetic) {
            document.querySelector("#text_mode").innerHTML = "æ";
            document.querySelector("#book_bʊ́k").innerHTML = "bʊ́k:"
            document.querySelector("#chapter_ʧǽptər").innerHTML = "ʧǽptər:"
            document.querySelector("#kindle").innerHTML = "báɪ kᵻ́ndəl"
            const book_title = truncateString(obj_tracks[this.BXXX]["C000"]["S000"]["tran"])
            const chapter_title =   truncateString(obj_tracks[this.BXXX][this.CXXX]["S000"]["tran"])
            const text = obj_tracks[this.BXXX][this.CXXX][this.SXXX]["tran"]
            document.querySelector("#book_title").innerHTML = book_title
            document.querySelector("#chapter_title").innerHTML = chapter_title
            document.querySelector("#sentence_number").innerHTML = addOneToNumber(this.SXXX.slice(2, 4))
            document.querySelector("#sentence_total_number").innerHTML = Object.keys(obj_tracks[this.BXXX][this.CXXX]).length.toString().padStart(2, '0') 
            document.querySelector("#text").innerHTML = `${text}`
            if (this.CXXX === "C000"){
                document.querySelector("#chapter_title").innerHTML = "ᵻ̀ntrədʌ́kʃən"
            }
        } else {
            document.querySelector("#text_mode").innerHTML = "a";
            document.querySelector("#book_bʊ́k").innerHTML = "Book:"
            document.querySelector("#chapter_ʧǽptər").innerHTML = "Chapter:"
            document.querySelector("#kindle").innerHTML = "Buy Kindle"
            const book_title = truncateString(obj_tracks[this.BXXX]["C000"]["S000"]["text"])
            const chapter_title =   truncateString(obj_tracks[this.BXXX][this.CXXX]["S000"]["text"])
            const text = obj_tracks[this.BXXX][this.CXXX][this.SXXX]["text"]
            document.querySelector("#book_title").innerHTML = book_title
            document.querySelector("#chapter_title").innerHTML = chapter_title
            document.querySelector("#sentence_number").innerHTML = addOneToNumber(this.SXXX.slice(2, 4))
            document.querySelector("#sentence_total_number").innerHTML = Object.keys(obj_tracks[this.BXXX][this.CXXX]).length.toString().padStart(2, '0') 
            document.querySelector("#text").innerHTML = `${text}`
            if (this.CXXX === "C000"){
                document.querySelector("#chapter_title").innerHTML = "Introduction"
            }
        }
    },

    refresh_repeat(){
        if (this._isRepeat){
            document.querySelector("#repeat").innerHTML = get_ICON("si_repeat")
        } else {
            document.querySelector("#repeat").innerHTML = get_ICON("no_repeat")
        }
    },

    refresh_HardMuted(){
        if (this._isHardMuted){
            document.querySelector("#sound").innerHTML = get_ICON("no_sound")
            pause_play()
        } else {
            document.querySelector("#sound").innerHTML = get_ICON("si_sound")
            play()
        }
    },

    refresh_SoftMuted(){
        if (this._isSoftMuted){
            document.querySelector("#sound").innerHTML = get_ICON("no_sound")
            pause_play()
        } else {
            document.querySelector("#sound").innerHTML = get_ICON("si_sound")
            play()
        }
    },

    refresh(){
        this.refresh_text()
        this.refresh_repeat()
        this.refresh_HardMuted()
    }
}

function resizeText() {
    const isOverflown = ({ clientHeight, scrollHeight }) => scrollHeight > clientHeight;
    const element = document.querySelector('#text')
    let i = 1.8;
    let overflow = true;
    while (overflow) {
        element.style.fontSize = `${i}rem`;
        overflow = isOverflown(element);
        if (overflow) {
            i -= 0.02;
        }
    }
}

function deleteElementAndChildren(elementId) {
    const parent = document.getElementById(elementId);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    parent.remove()
}

function truncateString(str) {
    const max_length = 28
    str = str.trim().replace(".", "").replace(":", "").trim()
    str = str.replace("ðə 101 móʊst ᵻ̀mpɔ́rtənt kɒ́nsɛpts əv ", "")
    str = str.replace("ðə 101 móʊst ᵻ́ntərəstᵻŋ kɒ́nsɛpts əv ", "")
    str = str.replace("ðə 101 móʊst mɛ́mərəbəl ", "")
    str = str.replace("The 101 most important concepts of ", "")
    str = str.replace("The 101 Most Interesting Concepts of ", "")
    str = str.replace("The 101 most memorable ", "")

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
    const folder = TEXTS_TRANS === "TEXTS" ? "text" : "transcriptions"
    const xxxxxx = TEXTS_TRANS === "TEXTS" ? "TEXTS" : "TRANS"
    const urls = [
        `./${folder}/books/B001/B001_${xxxxxx}_ALL.txt`,
        `./${folder}/books/B002/B002_${xxxxxx}_ALL.txt`,
        `./${folder}/books/B009/B009_${xxxxxx}_ALL.txt`,
        `./${folder}/books/B014/B014_${xxxxxx}_ALL.txt`,
    ]
    for (const url of urls){
        const text = get_text(url)
        if (text !== ""){
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

function get_text(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    if (xhr.status === 200) {
        return xhr.responseText;
    } else {
        console.log("ERROR: File missing: " + url)
        return "";
    }
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

function getEdgeVoice(){
    // Microsoft Ava Online (Natural) - English (United States)
    // Microsoft Andrew Online (Natural) - English (United States)
    // Microsoft Emma Online (Natural) - English (United States)
    // Microsoft Brian Online (Natural) - English (United States)
    // Microsoft Ana Online (Natural) - English (United States)
    // Microsoft Aria Online (Natural) - English (United States)
    // Microsoft Christopher Online (Natural) - English (United States)
    // Microsoft Eric Online (Natural) - English (United States)
    // Microsoft Guy Online (Natural) - English (United States)
    // Microsoft Jenny Online (Natural) - English (United States)
    // Microsoft Michelle Online (Natural) - English (United States)
    // Microsoft Roger Online (Natural) - English (United States)
    // Microsoft Steffan Online (Natural) - English (United States)

    // Microsoft George - English (United Kingdom)
    // Microsoft Hazel - English (United Kingdom)
    // Microsoft Susan - English (United Kingdom)
    // Google US English
    // Google UK English Male
    // Google UK English Female

    const voiceNames = [
        "Microsoft Ava Online (Natural)",
        "Microsoft Andrew Online (Natural)",
        "Google UK English Male",
        "Google UK English Female",
    ]
    for (const voiceName of voiceNames){
        const voices = window.speechSynthesis.getVoices();
        for (let i = 0; i < voices.length; i++) {
            if (voices[i].name.includes(voiceName)) {
                return voices[i];
            }
        }    
    }
    return undefined    
}

function play(){
    console.log("#01")
    STATE.refresh_text();
    resizeText()
    if (!STATE.isHardMuted && !STATE.isSoftMuted) {
        const edgeVoice = getEdgeVoice()  
        if (edgeVoice !== undefined){
            pause_play()
            const text = obj_tracks[STATE.BXXX][STATE.CXXX][STATE.SXXX]["text"];
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = edgeVoice
            utterance.rate = 0.85;
            utterance.onend = function(){
                setTimeout(function () {
                    if (!STATE.isRepeat){
                        next_track()
                        console.log("#02")
                    } else {
                        play()
                        console.log("#03")                        
                    }
                }, 600)
            }
            window.speechSynthesis.speak(utterance);
        } else {
            pause_play()      
            const audioFileFullPath = obj_tracks[STATE.BXXX][STATE.CXXX][STATE.SXXX]["audio"];
            const audio = new Audio(audioFileFullPath);
            audio.playbackRate = playbackRate;
            audios.push(audio)
            audio.addEventListener("ended", function () {
                setTimeout(function () {
                    if (!STATE.isRepeat){
                        next_track()
                        console.log("#05")
                    } else {
                        play()
                        console.log("#06")                        
                    }
                }, 600)
            })
            audio.play()                    
        }
    }
}

function pause_play() {
    window.speechSynthesis.cancel()
    audios.map(audio => {
        audio.pause();
    })
}

function book_up(){
    const books = Object.keys(obj_tracks)
    const iBXXX = books.indexOf(STATE.BXXX)
    if (iBXXX < books.length - 1) {
        STATE.BXXX = books[iBXXX + 1]
        STATE.CXXX = "C000"
        STATE.SXXX = "S000"
        STATE.refresh_text()
        play()
    }
}

function book_down(){
    const books = Object.keys(obj_tracks)
    const iBXXX = books.indexOf(STATE.BXXX)
    if (iBXXX > 0){
        STATE.BXXX = books[iBXXX - 1]
        STATE.CXXX = "C000"
        STATE.SXXX = "S000"
        STATE.refresh_text()
        play()
    }
}

function chapter_up(){
    const chapters = Object.keys(obj_tracks[STATE.BXXX])
    const iCXXX = chapters.indexOf(STATE.CXXX)
    if (iCXXX < chapters.length - 1){
        STATE.CXXX = chapters[iCXXX + 1]
        STATE.SXXX = "S000"
        STATE.refresh_text()
        play()
    }
}

function chapter_down(){
    const chapters = Object.keys(obj_tracks[STATE.BXXX])
    const iCXXX = chapters.indexOf(STATE.CXXX)
    if (iCXXX > 0) {
        STATE.CXXX = chapters[iCXXX - 1]
        STATE.SXXX = "S000"
        STATE.refresh_text()
        play()
    }
}

function sentence_up() {
    const sentences = Object.keys(obj_tracks[STATE.BXXX][STATE.CXXX])
    const iSXXX = sentences.indexOf(STATE.SXXX)
    if (iSXXX < sentences.length - 1){
        STATE.SXXX = sentences[iSXXX + 1]
        STATE.refresh_text()
        play()
    }
}

function sentence_down(){
    const sentences = Object.keys(obj_tracks[STATE.BXXX][STATE.CXXX])
    const iSXXX = sentences.indexOf(STATE.SXXX)
    if (iSXXX > 0) {
        STATE.SXXX = sentences[iSXXX - 1]
        STATE.refresh_text()
        play()
    }
}

function next_track(){
    const books = Object.keys(obj_tracks)
    const chapters = Object.keys(obj_tracks[STATE.BXXX])
    const sentences = Object.keys(obj_tracks[STATE.BXXX][STATE.CXXX])

    const iBXXX = books.indexOf(STATE.BXXX)
    const iCXXX = chapters.indexOf(STATE.CXXX)
    const iSXXX = sentences.indexOf(STATE.SXXX)

    isLastSentence = iSXXX >= sentences.length - 1
    isLastChapter = iCXXX >= chapters.length - 1
    isLastBook = iBXXX >= books.length - 1 

    if (!isLastSentence) {
        STATE.SXXX = sentences[iSXXX + 1]
    } else if (!isLastChapter) {
        STATE.CXXX = chapters[iCXXX + 1]
        STATE.SXXX = "S000"
    } else if (!isLastBook) {
        STATE.BXXX = books[iBXXX + 1]
        STATE.CXXX = "C000"
        STATE.SXXX = "S000"
    } else {
        pause_play()
        // Do nothing
        // STATE.BXXX = "B001"
        // STATE.CXXX = "C000"
        // STATE.SXXX = "S000"
    }
    STATE.refresh_text()
    play()
}

document.querySelector("#text_mode").addEventListener("click", function () {
    STATE.isPhonetic = !STATE.isPhonetic
    STATE.refresh_text()
})

document.querySelector("#repeat").addEventListener("click", function () {
    STATE.isRepeat = !STATE.isRepeat
    console.log("click_repeat")
    STATE.refresh_repeat()
})

document.querySelector("#sound").addEventListener("click", function () {
    STATE.isHardMuted = !STATE.isHardMuted
    STATE.refresh_HardMuted()
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
      document.querySelector("#max_min").innerHTML = get_ICON("exit_fullscreen")
    } else {
      document.querySelector("#max_min").innerHTML = get_ICON("enter_fullscreen")
    }
});

document.querySelector("#text-row").addEventListener("click", function () {
    next_track()
})

window.addEventListener('resize', () => {
    const screenWidth = document.documentElement.clientWidth;
    const screenHeight = document.documentElement.clientHeight;
    for (const id of ["top", "book", "chapter", "sentence"]){
        if (screenWidth > screenHeight * 1.8) {
            document.querySelector(`#${id}-row`).style.display = 'none'; 
        } else {
            document.querySelector(`#${id}-row`).style.display = 'flex';
        }
    }
});

document.querySelector("#book_up").addEventListener("click", function () {
    if (document.querySelector("#list") !== null) {
        deleteElementAndChildren("list")
        showBelowBookRow()
        showBelowChapterRow()
        STATE.isSoftMuted = false
        STATE.refresh()
        return
    }
    book_up
})
document.querySelector("#book_down").addEventListener("click", function () {
    if (document.querySelector("#list") !== null) {
        deleteElementAndChildren("list")
        showBelowBookRow()
        showBelowChapterRow()
        STATE.isSoftMuted = false
        STATE.refresh()
        return
    }
    book_down
})
document.querySelector("#chapter_up").addEventListener("click", chapter_up)
document.querySelector("#chapter_down").addEventListener("click", chapter_down)
document.querySelector("#sentence_up").addEventListener("click", sentence_up)
document.querySelector("#sentence_down").addEventListener("click", sentence_down)

document.querySelector("#kindle").addEventListener("click", function () {
    const url = "https://www.amazon.co.uk/brief-history-Artificial-Intelligence-ebook/dp/B0C5DWF7LL/ref=sr_1_3?crid=JZR2GY582PLP&dib=eyJ2IjoiMSJ9.JnBwUikzDVNNbEBB3gsQGVjRNSPLyT3gYzaAVz44pMZkinZ2mpvIvTDbTUKt9ivXrs5HR4ckDZpTCX1nC9R06LN5_NIUbWEeNuYFwLwgLoDSLHiCNc5Taowts64SYdidzUzgagp5r7FpcDgTGH_r3LUhYqZEFh9ZRFjASlfAOqW30o0jdtelu9-22fMh9u5zon1m3MFhXafZ_JsirOTh5Y4czrNsONOzbnLKSJulIFI.nFU77SXnHOo00pTQW5pVrVxoCGclOMu0-I1M0x3GWf4&dib_tag=se&keywords=kindle+a+brief+history+of+artificial+intelligence&qid=1717773263&sprefix=kindle+a+brief+history+of+artificial+intelligence%2Caps%2C91&sr=8-3"
    openInNewTab(url)
})

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();        
        next_track();
    }
});

function hideBelowBookRow(){
    document.querySelector("#chapter-row").style.display = "none"
    document.querySelector("#sentence-row").style.display = "none"
    document.querySelector("#text-row").style.display = "none"
    document.querySelector("#book_down").style.display = "none"
    document.querySelector("#book_up").style.display = "none"
    document.querySelector("#book > .title").style.display = "none"
}

function showBelowBookRow(){
    document.querySelector("#chapter-row").style.display = "flex"
    document.querySelector("#sentence-row").style.display = "flex"
    document.querySelector("#text-row").style.display = "flex"
    document.querySelector("#book_down").style.display = "flex"
    document.querySelector("#book_up").style.display = "flex"
    document.querySelector("#book > .title").style.display = "flex"
}

function hideBelowChapterRow(){
    document.querySelector("#sentence-row").style.display = "none"
    document.querySelector("#text-row").style.display = "none"
    document.querySelector("#chapter_down").style.display = "none"
    document.querySelector("#chapter_up").style.display = "none"
    document.querySelector("#chapter > .title").style.display = "none"
}

function showBelowChapterRow(){
    document.querySelector("#sentence-row").style.display = "flex"
    document.querySelector("#text-row").style.display = "flex"
    document.querySelector("#chapter_down").style.display = "flex"
    document.querySelector("#chapter_up").style.display = "flex"
    document.querySelector("#chapter > .title").style.display = "flex"
}

document.querySelector("#book").addEventListener("click", function (){
    STATE.isSoftMuted = true
    STATE.refresh_SoftMuted()
    if (document.querySelector("#list") !== null) {
        deleteElementAndChildren("list")
        showBelowBookRow()
        showBelowChapterRow()
        STATE.isSoftMuted = false
        STATE.refresh()
        return
    }
    hideBelowBookRow()
    const div_list = document.createElement("div");
    div_list.id = "list"
    div_list.className = "column list";
    document.querySelector("#app").appendChild(div_list);
    if (STATE.isPhonetic){
        document.querySelector("#book_title").innerHTML = "ʧúz ə bʊ́k:"
    } else {
        document.querySelector("#book_title").innerHTML = "Choose a Book:"
    }
    const BXXXs = Object.keys(obj_tracks)
    for (const BXXX of BXXXs){
        const div = document.createElement("div");
        div.className = "row list-element";
        div.innerHTML = truncateString(obj_tracks[BXXX]["C000"]["S000"][STATE.get_mode_text()])
        div.addEventListener("click", function() {
            STATE.BXXX = BXXX
            STATE.CXXX = "C000"
            STATE.SXXX = "S000"
            deleteElementAndChildren("list")
            showBelowBookRow()
            STATE.isSoftMuted = false
            STATE.refresh()    
        });
        div_list.appendChild(div);
    }
})

document.querySelector("#chapter").addEventListener("click", function (){
    STATE.isSoftMuted = true
    STATE.refresh_SoftMuted()
    if (document.querySelector("#list") !== null) {
        deleteElementAndChildren("list")
        showBelowChapterRow()
        STATE.isSoftMuted = false
        STATE.refresh()
        return
    }
    hideBelowChapterRow()
    const div = document.createElement("div");
    div.id = "list"
    div.className = "column list";
    document.querySelector("#app").appendChild(div);
    if (STATE.isPhonetic){
        document.querySelector("#chapter_title").innerHTML = "ʧúz ə ʧǽptər:"
    } else {
        document.querySelector("#chapter_title").innerHTML = "Choose a Chapter:"
    }
    const CXXXs = Object.keys(obj_tracks[STATE.BXXX])
    for (const CXXX of CXXXs){ 
        const div = document.createElement("div");
        div.className = "row list-element";
        if (CXXX !== "C000"){
           div.innerHTML = truncateString(obj_tracks[STATE.BXXX][CXXX]["S000"][STATE.get_mode_text()]) 
        } else if (STATE.isPhonetic) {
            div.innerHTML = "ᵻ̀ntrədʌ́kʃən"
        } else {
            div.innerHTML = "Introduction"
        }
        div.addEventListener("click", function(){
            STATE.CXXX = CXXX
            STATE.SXXX = "S000"
            deleteElementAndChildren("list")
            showBelowChapterRow()
            STATE.isSoftMuted = false
            STATE.refresh()
        });
        document.querySelector("#list").appendChild(div);
    }
})

const audios = []
const playbackRate = 0.8
const filtered_out_chapters = get_filtered_out_chapters()
const unfiltered_obj_tracks = get_obj_tracks()
const obj_tracks = applyfiter(unfiltered_obj_tracks, filtered_out_chapters) 
STATE.refresh()