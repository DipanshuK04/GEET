async function main(folder) {
    let URL = `http://127.0.0.1:5500/GEET/Sons_tp/${folder}/`;
    let response = await fetch(URL);
    let htmlText = await response.text();
    
    let tempElement = document.createElement('div');
    tempElement.innerHTML = htmlText;

    let links = tempElement.querySelectorAll('#files a');
    let songNames = [];

    links.forEach(function(link) {
        if (link.querySelector('.name').innerHTML.endsWith(".mp3")) {
            let songName = link.href;
            songNames.push(songName);
        }
    });
    return songNames;
}
let sn ;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(0);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function displayFormattedTime(currentTime, duration) {
    const formattedCurrentTime = formatTime(currentTime);
    const formattedDuration = formatTime(duration);
    return `${formattedCurrentTime} : ${formattedDuration}`;
}

let CurrentSong = new Audio();
let play = document.getElementById('play');

PlaySong = (track,tp) => {
    CurrentSong.src = track;
    // console.log(CurrentSong)
    CurrentSong.play();
    document.querySelector(".songinfo").innerText = `${tp}`;
    document.querySelector(".songtime").innerHTML = "00:00 // 00:00";
}
async function SongName(folder) {
    sn = await main(folder);
    let songListContainer = document.querySelector(".songList ul");
    songListContainer.innerHTML = "";

    sn.forEach(song => {
        let tp = song.split("/Sons_tp/")[1].replaceAll(".mp3", "").replaceAll("%20", " ");
        tp = tp.replaceAll(`${folder}/`, "");
        let li = document.createElement('li');
        li.className = "no-border";
        li.innerHTML = `
            <i class="fa-solid fa-music ui"></i>
            <div class="songname">${tp}</div>
            <i class="plbar fa-solid fa-play"></i>
        `;

        let pbar = li.querySelector('.plbar');
        li.addEventListener("click", async () => {
            // Play the clicked song
            PlaySong(song, tp);
            play.className = "fa-solid fa-pause";
            console.log("Playing:", tp);
        });
        pbar.addEventListener("click", () => {
            if (CurrentSong.paused) {
                play.className = "fa-solid fa-pause";
                pbar.className = "plbar fa-solid fa-pause";
                CurrentSong.play();
            } else {
                play.className = "fa-solid fa-play";
                pbar.className = "plbar fa-solid fa-play";
                CurrentSong.pause();
            }
        });

        songListContainer.appendChild(li);
    });
}

play.addEventListener("click", () => {
    if(CurrentSong.paused){
        play.className = "fa-solid fa-pause";
        CurrentSong.play();
    }else{
        play.className = "fa-solid fa-play";
        CurrentSong.pause();
    }
});

let ct = document.querySelector(".songtime");
let cs = document.querySelector(".circle");
CurrentSong.addEventListener("timeupdate", () =>{
    cs.style.left = (CurrentSong.currentTime/CurrentSong.duration*100) + "%" ;
    ct.innerText = displayFormattedTime(CurrentSong.currentTime,CurrentSong.duration);
});


document.querySelector(".seekbar").addEventListener(("click"),e => {
    // console.log(e.target.getBoundingClientRect().width);
    console.log(e);
    let percent = e.offsetX/e.target.getBoundingClientRect().width*100;
    cs.style.left = percent + "%";
    CurrentSong.currentTime = CurrentSong.duration*percent/100;
});

document.querySelector(".hamburger").addEventListener("click",e =>{
    document.querySelector(".left").style.left = "0%";
    document.querySelector(".left").style.width = "100%";
    document.querySelector(".left").style.height = "100vh";
    console.log("clicked menu");
    document.querySelector(".cross").style.display = 'inline';
    document.querySelector(".cross").addEventListener("click" ,() =>{
        document.querySelector(".left").style.left = "-100%";
    });
});

document.querySelector("#backward").addEventListener("click" ,() =>{
    // console.log(CurrentSong);
    let index = sn.indexOf(CurrentSong.src);
    index= index-1;
    let tp = sn[index].split("/Sons_tp/")[1].replaceAll(".mp3", "").replaceAll("%20", " ");
    PlaySong(sn[index],tp);
    // console.log(sn)
});

document.querySelector("#forward").addEventListener("click" ,() =>{
    let index = sn.indexOf(CurrentSong.src);
    index= index+1;
    let tp = sn[index].split("/Sons_tp/")[1].replaceAll(".mp3", "").replaceAll("%20", " ");
    PlaySong(sn[index],tp);
});



const volSeekbar = document.querySelector('.vol-seekbar');
    const circleVol = document.querySelector('.circle-vol');

    // Function to update volume based on click position
    function updateVolume(e) {
        let percent = (e.offsetX / volSeekbar.clientWidth) * 100;
        circleVol.style.left = percent + "%";
        let volume = percent / 100; // Volume value between 0 and 1

        // Example: Update volume of CurrentSong (replace with your actual player control logic)
        CurrentSong.volume = volume;
        if(volume>=0.5){
            document.querySelector(".volbar").getElementsByTagName("i")[0].className ="fa -solid fa-volume-high" + "  volume";
        }
        if(volume<0.5){
            document.querySelector(".volbar").getElementsByTagName("i")[0].className ="fa-solid fa-volume-low" + "  volume";
        }
        if(volume == 0){
            document.querySelector(".volbar").getElementsByTagName("i")[0].className = "fa-solid fa-volume-xmark" + "  volume";
        }
        console.log('Volume:', volume);
    }

    // Click event listener for the volume seekbar
    volSeekbar.addEventListener('click', function(e) {
        updateVolume(e);
    });



let folder="";
const cards = document.querySelectorAll(".card");
cards.forEach(card => {
    card.addEventListener("click", () => {
        folder = card.querySelector(".playbtn").id;
        SongName(folder);
    });
});
    



async function DisplayFolders() {
    let a = `http://127.0.0.1:5500/GEET/Sons_tp/`;
    let reply = await fetch(a);
    let textht = await reply.text();
    let cardcontainer = document.querySelector(".cardContainer")
    let TE= document.createElement('div');
    TE.innerHTML = textht;
    TE = TE.querySelectorAll("li a")
    TE.forEach( async function(te) {
        let fldr = te.title;
        let a = `http://127.0.0.1:5500/GEET/Sons_tp/${fldr}/`;
        let ry = await fetch(a);
        let tht = await ry.json();
        cardcontainer.innerHTML = cardcontainer.innerHTML + `<div class="card no-border">
                        <div id="HappyHits" class="playbtn no-border">
                            <i class="fa-sharp fa-regular fa-circle-play"></i>
                            <img src="1900631.jpg" class="no-border">
                        </div>
                        <h3 class="no-border">${tht.title}</h3>
                        <p class="no-border">${tht.description}</p>
                    </div>`
        console.log(tht);
    });
}

DisplayFolders() 