let gameStart = false, time = 200
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let pixel = 10
let cWidth = canvas.width
let cHeight = canvas.height
let chickens = []
let deathChickens = []
let seeds = []
let timeSeeds = 0
let player = undefined
let timeGame = 0
let newGeration = 0
let BL = []

function padrao(x,y,dna){
    return{
        kill: false,
        x: x || random(0,cWidth/10)*pixel - pixel,
        y: y || random(0,cHeight/10)*pixel - pixel,
        time: 0,
        dna: dna || {
            lifeMin: 30,
            visao:5,
            timeMax: 250,
            timeMin: 30,
            life: 20,
            size: 10
        }
    }
}

for(let i = 0;i<1000;i++){
   newSeed()
}

function status(){ document.getElementById('tChickens').innerHTML = `
    <p> | Tempo de jogo: ${parseInt(timeGame)} | </p>
    <p> | Total de galinhas: ${chickens.length} | </p>
    <p> | Total de sementes: ${seeds.length} | </p>
    <p> | Nova geração: ${newGeration} | </p>`
}

function statuschickens(chicken) { document.getElementById('status').innerHTML = `
    <p id='p2'> | Life: ${parseInt(chicken.dna.life)} | </p>
    <p id='p2'> | Time: ${parseInt(chicken.time)} | </p>
    <p id='p2'> | Position: ${chicken.x} - ${chicken.y} | </p>
    <p id='p2'> | Tamanho: ${chicken.dna.size} | </p>`
}

function pauseStart(){
    let test = document.getElementById("start-pause").value
    if(test === "Pause"){test = "Start"}else{test = "Pause"}
    document.getElementById("start-pause").value = test
    gameStart = !gameStart
}

function startChikens(){
    let n = document.getElementById('nChickens').value
    randowChickens(n)
}

function startPlayer() { player = padrao() }

window.onload = function startSimulation(){
    if(gameStart === true){drawCanvas();addEventListener("keydown",movePlayer)}
    setTimeout(startSimulation,time)
}

function randowChickens(n){
    for(let i = 0; i < n;i++){
        newChicken()
    }
}

function drawCanvas(){ timeGame += 1/10

    draw(0,0,cWidth,cHeight,"rgb(50,200,50)")

    for(i in BL){
        draw(BL[i].x,BL[i].y,10,10,"crimson")
    }
    
    if(player !== undefined){
        statuschickens(player)
        draw(player.x,player.y,player.dna.size,player.dna.size,"blue")
        player.dna.life += colidSeeds(player)
        player.time += 1/10
        if(player.dna.life < 1){statuschickens(player);player = undefined}
    }else{
        if(chickens[0]){statuschickens(chickens[0])}
        
    }

    for(let id in chickens){

        if(chickens[id].kill === true || chickens[id].time > chickens[id].dna.timeMax){
            chickens[id].dna.life = 0
            deathChickens.push(chickens[id])
        }else{

            if(chickens[id].time < chickens[id].dna.timeMin && chickens[id].dna.life < chickens[id].dna.lifeMin){chickens[id].cor = "white"}
            else{chickens[id].cor = "gray"}

            draw(chickens[id].x,chickens[id].y,chickens[id].dna.size,chickens[id].dna.size,chickens[id].cor)
            moveChicken(id)
            colid(id)
            if(chickens[id].dna.life < 1){ chickens[id].kill = true }
        }
        chickens[id].dna.life += colidSeeds(chickens[id])
        chickens[id].time += 1/10
    }

    for(let kill of deathChickens){
        let id = chickens.indexOf(kill)
        if(id >= 0){ chickens.splice(id,1) }
    }

    for(let id in deathChickens){
        if(deathChickens[id].dna.life <= -2){deathChickens.splice(id,1)}else{
            draw(deathChickens[id].x,deathChickens[id].y,deathChickens[id].dna.size,deathChickens[id].dna.size,"red")
            deathChickens[deathChickens.length-1].dna.life += colidSeeds(deathChickens[deathChickens.length-1])
        }
    }

    for(let id in seeds){
        let seed = seeds[id]
        if(seed.x < 0 || seed.y < 0){seeds.splice(id,1)}else{
            let m = ((pixel-pixel/2)/2)
            draw(seed.x + m,seed.y + m,seed.size,seed.size,"green")
        }
    }

    if(timeSeeds <= 0){newSeed(); timeSeeds = time/10}else{timeSeeds -= 1}

    status()
}

function draw(x,y,w,h,cor){
    ctx.fillStyle = cor
    ctx.fillRect(x,y,w,h)
}

function newSeed(x,y) {
    seed = {
        size: pixel/2,
        x: x || (random(0,cWidth/10)*pixel - pixel), // SIMPLIFICAR
        y: y || (random(0,cHeight/10)*pixel - pixel)  
    }
    if(seeds.indexOf(seed) < 0){seeds.push(seed)}else{console.log(seed)}
}

function newChicken(x,y,dna) { chickens.push(padrao(x,y,dna)) }

function radar(chicken,Seeds){
    let listSeed = []
    x1 = chicken.x - chicken.dna.visao*pixel
    y1 = chicken.y - chicken.dna.visao*pixel
    x2 = chicken.x + chicken.dna.visao*pixel
    y2 = chicken.y + chicken.dna.visao*pixel

    for(seed of Seeds){
        if(seed.x > x1 && seed.x < x2 && seed.y > y1 && seed.y < y2){
            listSeed.push(seed)
        } 
    }
    return listSeed
}

function moveChicken(id){
    let x = 0, y = 0, dire = random(1,100)

    if(dire <= 50){dire = radar(chickens[id],seeds)}else{dire = radar(chickens[id],chickens)}

    let direct = direction(chickens[id],dire)

    if(direct <= 1000){y = -pixel}
    else if(direct <= 2000){y = pixel}
    else if(direct <= 3000){x = -pixel}
    else if(direct <= 4000){x = pixel}
    else if(direct <= 5000){x = -pixel, y = -pixel}
    else if(direct <= 6000){x = pixel, y = -pixel}
    else if(direct <= 7000){x = -pixel, y = pixel}
    else if(direct <= 8000){x = pixel, y = pixel}

    if(chickens[id].x < pixel && x < 0 || chickens[id].x > cWidth - pixel*2 && x > 0){x=0}
    if(chickens[id].y < pixel && y < 0 || chickens[id].y > cHeight - pixel*2 && y > 0){y=0}

    chickens[id].x += x, chickens[id].y += y
}

function direction(chicken,listSeed){
    if(listSeed.length > 0){
      let d = []
        for(Seed of listSeed){
            d.push(Math.sqrt((Seed.x - chicken.x)**2 + (Seed.y - chicken.y)**2))
        }
        let seed = listSeed[d.indexOf(Math.min(...d))]
        if(seed.y < chicken.y && seed.x < chicken.x){return 5000}
        if(seed.y < chicken.y && seed.x > chicken.x){return 6000}
        if(seed.y > chicken.y && seed.x < chicken.x){return 7000}
        if(seed.y > chicken.y && seed.x > chicken.x){return 8000}
        if(seed.y < chicken.y){return 1000}
        if(seed.y > chicken.y){return 2000}
        if(seed.x < chicken.x){return 3000}
        if(seed.x > chicken.x){return 4000}
    }
    return random(1,8000)
}

function movePlayer(event){
    if(player && gameStart){
        let x = 0; let y = 0
        switch(event.keyCode){
            case 65:x = -pixel;mover(); break;
            case 87:y = -pixel;mover(); break;
            case 68:x = pixel;mover(); break;
            case 83:y = pixel;mover(); break;
        }
        function mover(){
            if(player.x < pixel && x < 0 || player.x > cWidth - pixel*2 && x > 0){x=0}
            if(player.y < pixel && y < 0 || player.y > cHeight - pixel*2 && y > 0){y=0}
            player.x += x ; player.y += y
        }
    }
}

function colidSeeds(chicken){
    for(seed of seeds){
        if(chicken.x === seed.x && chicken.y === seed.y){
            seed.x = -10
            seed.y = -10
            return 3
        }
    } return -1/10
}

function colid(idA){
    for(idB in chickens){
        if(idA !== idB){
            let ifA = chickens[idA].x === chickens[idB].x && chickens[idA].y === chickens[idB].y
            let ifB = chickens[idA].time > chickens[idA].dna.timeMin && chickens[idB].time > chickens[idB].dna.timeMin
            let ifC = chickens[idA].dna.life > chickens[idA].dna.lifeMin && chickens[idB].dna.life > chickens[idB].dna.lifeMin

            if( ifA && ifB && ifC){
                newGeration += 1
                console.log()
                newChicken(chickens[idA].x,chickens[idA].y)
            }
        }
    }
}

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}