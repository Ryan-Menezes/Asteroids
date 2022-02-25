(function(){
	// TECLAS DE MOVIENTAÇÃO DA NAVE
	const TECLAS = {
		top: [38, 87],
		bottom: [40, 83],
		left: [37, 65],
		right: [39, 68]
	}

	// IMGS MENSAGEM
	const LOGOBANNER = './IMGS/logo.png'
	const GAMEOVERBANNER = './IMGS/gameover.png'

	// STATUS DO JOGO
	const PLAYSTATUS = 0
	const GAMEOVERSTATUS = 1

	// VIDAS INICIAIS
	const INITLIFES = 3

	// ELEMENTOS DO HTML QUE SERÃO USADOS PARA COMEÇAR O JOGO E EXIBIR MENSAGENS AO JAGADOR
	const TELAMSG = window.document.getElementById('modal')
	const PLACARSCORE = window.document.getElementById('status')
	const BTNSTART = window.document.getElementById('btnStartGame')

	// CONSTANTES DE CONFIGURAÇÕES DO OBJETO TIRO
	const VELTIRO = 20
	const RAIOTIRO = 5

	// CONSTANTES DE CONFIGURAÇÕES DO OBJETO ASTEROID
	const VELASTEROID = 30
	const DELAYASTEROID = 0.006
	const LIMITEASTEROIDS = 10
	const TEMPOGERAASTEROID = 1000
	const RAIOLIMITEASTEROID = 10

	// CONSTANTES DE CONFIGURAÇÕES DO OBJETO NAVE
	const SIZENAVE = 50
	const LIMITEINIMIGOS = 1

	// PONTOS QUE SERÃO ACRESCIDOS AO SCORE DO JOGADOR
	const PONTOSASTEROID = 10
	const PONTOSINIMIGO = 50

	// CONSTANTES DE CONFIGURAÇÕES DO OBJETO LIFE
	const RAIOLIFE = 15
	const LIMITELIFES = 1
	const VELLIFE = 3

	// VARIÁVEIS DE CONFIGURAÇÕES DO JOGO
	var cnv, ctx
	var nave
	var mouse
	var controller
	var game
	
	// TEXTURAS DOS OBJETOS
	const IMAGENS = {
		FUNDO: new Image(),
		NAVE: new Image(),
		INIMIGO: new Image(),
		TIRO: new Image(),
		TIROINIMIGO: new Image(),
		ASTEROID: new Image,
		LIFE: new Image(),
		SCORE: new Image()
	}

	IMAGENS.FUNDO.src = './IMGS/fundo.jpg'
	IMAGENS.NAVE.src = './IMGS/nave.png'
	IMAGENS.INIMIGO.src = './IMGS/inimigo.png'
	IMAGENS.TIRO.src = './IMGS/laserBlue.png'
	IMAGENS.TIROINIMIGO.src = './IMGS/laserRed.png'
	IMAGENS.ASTEROID.src = './IMGS/asteroids.png'
	IMAGENS.LIFE.src = './IMGS/life.png'
	IMAGENS.SCORE.src = './IMGS/score.png'

	// AUDIOS DO JOGO
	const SOUNDS = {
		TIRO: new Audio(),
		NAVEMOVE: new Audio(),
		BANGSMALL: new Audio(),
		BANGMEDIUM: new Audio(),
		BANGLARGE: new Audio(),
		EXTRALIFE: new Audio(),
		INIMIGO: new Audio()
	}

	SOUNDS.TIRO.src = './SOUNDS/fire.wav'
	SOUNDS.NAVEMOVE.src = './SOUNDS/thrust.wav'
	SOUNDS.BANGSMALL.src = './SOUNDS/bangSmall.wav'
	SOUNDS.BANGMEDIUM.src = './SOUNDS/bangMedium.wav'
	SOUNDS.BANGLARGE.src = './SOUNDS/bangLarge.wav'
	SOUNDS.EXTRALIFE.src = './SOUNDS/extraShip.wav'
	SOUNDS.INIMIGO.src = './SOUNDS/saucerBig.wav'

	// VETORES QUE ARMAZENERÃO OS OBJETOS CRIADOS DURANTE O JOGO
	var tiros
	var asteroids
	var inimigos

	window.onload = function(){
		init()

		window.onkeydown = function(event){
			if(TECLAS.top.includes(event.keyCode)) controller.top = true
			if(TECLAS.bottom.includes(event.keyCode)) controller.bottom = true
			if(TECLAS.left.includes(event.keyCode)) controller.left = true
			if(TECLAS.right.includes(event.keyCode)) controller.right = true
		}

		window.onkeyup = function(event){
			if(TECLAS.top.includes(event.keyCode)) controller.top = false
			if(TECLAS.bottom.includes(event.keyCode)) controller.bottom = false
			if(TECLAS.left.includes(event.keyCode)) controller.left = false
			if(TECLAS.right.includes(event.keyCode)) controller.right = false
		}

		BTNSTART.onclick = () => {
			TELAMSG.style.display = 'none'
			game.played = true
		}

		window.onresize = function(){
			if(cnv !== undefined){
				cnv.width = window.document.documentElement.clientWidth
				cnv.height = window.document.documentElement.clientHeight - 4
			}
		}
	}

	function createCanvas(){
		cnv = window.document.createElement('canvas')
		cnv.width = window.document.documentElement.clientWidth
		cnv.height = window.document.documentElement.clientHeight - 4
		window.document.body.appendChild(cnv)

		ctx = cnv.getContext('2d')

		cnv.onmousemove = function(event){
			mouse.x = event.clientX - cnv.offsetLeft
			mouse.y = event.clientY - cnv.offsetTop
		}

		cnv.onmousedown = () => tiros.push(nave.shoot(mouse, VELTIRO, RAIOTIRO, IMAGENS.TIRO, SOUNDS.TIRO.cloneNode(true)))
	}

	function init(){
		createCanvas()
		restart()
		setInterval(createAsteroid, TEMPOGERAASTEROID)
		loop()
	}

	function restart(status = PLAYSTATUS){
		// Inicializando variaveis de configurações

		let score = (game !== undefined) ? game.score : 0

		game = {
			played: false,
			score: 0,
			lifes: INITLIFES,
			turns: 0
		}

		mouse = {
			x: 0,
			y: 0
		}

		controller = {
			top: false,
			bottom: false,
			left: false,
			right: false
		}

		tiros = []
		asteroids = []
		inimigos = []
		lifes = []

		if(status === PLAYSTATUS) TELAMSG.getElementsByTagName('img')[0].src = LOGOBANNER
		else{
			PLACARSCORE.getElementsByClassName('score')[0].innerText = score
			PLACARSCORE.style.display = 'flex'
			TELAMSG.getElementsByTagName('img')[0].src = GAMEOVERBANNER
		}

		TELAMSG.style.display = 'flex'

		// Inicializando personagens

		nave = new Nave(cnv.width/2 - SIZENAVE/2, cnv.height/2 - SIZENAVE/2, SIZENAVE, IMAGENS.NAVE, SOUNDS.NAVEMOVE.cloneNode(true), true)
	}

	function createAsteroid(){
		if(asteroids.length < LIMITEASTEROIDS && game.played){
			let raio = Math.round(Math.random() * 40) + 30

			let x = 0
			let y = 0

			if(Math.round(Math.random())){
				x = Math.round(Math.random()) ? cnv.width : -(raio * 2)
				y = Math.round(Math.random() * (cnv.height))
			}else{
				x = Math.round(Math.random() * (cnv.width))
				y = Math.round(Math.random()) ? cnv.height : -(raio * 2)
			}

			let velX = nave.distanceX(x + raio) * DELAYASTEROID
			let velY = nave.distanceY(y + raio) * DELAYASTEROID

			asteroids.push(new Asteroid(x, y, velX, velY, raio, IMAGENS.ASTEROID))
		}
	}

	function createInimigo(){
		if(inimigos.length < LIMITEINIMIGOS && game.played){
			let x = 0
			let y = 0

			if(Math.round(Math.random())){
				x = Math.round(Math.random()) ? cnv.width : -SIZENAVE
				y = Math.round(Math.random() * cnv.height)
			}else{
				x = Math.round(Math.random() * cnv.width)
				y = Math.round(Math.random()) ? cnv.height : -SIZENAVE
			}

			inimigos.push(new Nave(x, y, SIZENAVE, IMAGENS.INIMIGO, SOUNDS.INIMIGO.cloneNode(true), false))
		}
	}

	function createLife(){
		if(lifes.length < LIMITELIFES && game.played){
			let x = 0
			let y = 0
			let velX = 0
			let velY = 0

			if(Math.round(Math.random())){
				x = Math.round(Math.random()) ? cnv.width : -(RAIOLIFE * 2)
				y = Math.round(Math.random() * cnv.height)

				velX = (x == cnv.width) ? -VELLIFE : VELLIFE
			}else{
				x = Math.round(Math.random() * cnv.width)
				y = Math.round(Math.random()) ? cnv.height : -(RAIOLIFE * 2)

				velY = (y == cnv.height) ? -VELLIFE : VELLIFE
			}

			lifes.push(new Life(x, y, velX, velY, RAIOLIFE, IMAGENS.LIFE, SOUNDS.EXTRALIFE.cloneNode(true)))
		}
	}

	function createAudio(audio){
		let sound = audio.cloneNode(true)

		sound.onended = function(){
	        this.src = "";
	        this.srcObject = null;
	        this.remove();
	    };

	    sound.play()
	}

	function draw(){
		ctx.clearRect(0, 0, cnv.width, cnv.height)

		// Desenhando o fundo do game
		ctx.drawImage(IMAGENS.FUNDO, 0, 0, cnv.width, cnv.height)

		// Desenhando a nave
		nave.draw(ctx)

		// Desenhando os tiros na tela
		for(let tiro of tiros) tiro.draw(ctx)

		// Desenhando os asteroids na tela
		for(let asteroid of asteroids) asteroid.draw(ctx)

		// Desenhando os inimigos na tela
		for(let inimigo of inimigos) inimigo.draw(ctx)

		// Desenhando as vidas extras que o jagador pode coletar
		for(let life of lifes) life.draw(ctx)

		if(game.played){
			// Desenhando as vidas retantes do jogador
			for(let i = 0; i < game.lifes; i++) ctx.drawImage(IMAGENS.LIFE, (40 * i) + 40, 40, 40, 40)

			// Desenhando o score do jogador
			ctx.drawImage(IMAGENS.SCORE, 40, 85, 35, 35)

			ctx.fillStyle = '#fff'
			ctx.font = '35px Arial'
			ctx.fillText(game.score, 90, 115)
		}
	}

	function update(){
		// Movimentando os tiros e verificando várias colisões
		for(let t in tiros){
			let tiro = tiros[t]
			let colidiuTiro = false
			
			if(tiro){
				for(let a in asteroids){
					let asteroid = asteroids[a]
					let colidiuAsteroid = false
					let x, y

					if(asteroid){
						// Verificando colisão de tiro com asteroids
						if(tiro.collided(asteroid)){
							if(tiro.player) game.score += PONTOSASTEROID

							colidiuTiro = true
							colidiuAsteroid = true
							x = tiro.centerX()
							y = tiro.centerY()

							if(asteroid.raio <= RAIOLIMITEASTEROID) createAudio(SOUNDS.BANGSMALL)
							else if(asteroid.raio > RAIOLIMITEASTEROID && asteroid.raio <= RAIOLIMITEASTEROID + 10) createAudio(SOUNDS.BANGMEDIUM)
							else createAudio(SOUNDS.BANGLARGE)
						}

						// Caso o asteroid colida com algo será descontado o seu tamanho
						if(colidiuAsteroid){
							if(asteroid.raio <= RAIOLIMITEASTEROID) asteroids.splice(a, 1)
							else asteroids.push(asteroid.duplicate(x, y))
						}
					}
				}

				// Verificando colisão de tiro com a nave e os inimigos
				if(tiro.player){ // Tiro do jogador atinge um inimigo
					for(let i in inimigos){
						let inimigo = inimigos[i]
						
						if(inimigo && inimigo.collided(tiro)){
							game.score += PONTOSINIMIGO

							colidiuTiro = true

							inimigos.splice(i, 1)
							createAudio(SOUNDS.BANGMEDIUM)
						}
					}
				}else{ // Tiro do inimigo atinge o jogador
					if(!nave.invincible){
						if(nave.collided(tiro)){
							if(game.lifes > 0){
								game.lifes--
								nave.ghost()
							}else restart(GAMEOVERSTATUS)

							colidiuTiro = true

							createAudio(SOUNDS.BANGMEDIUM)
						}
					}
				}

				// Caso os tiros tenham colidido com algo, eles serão removidos do array
				if(colidiuTiro){
					tiros.splice(t, 1)
				}else{
					// Movimentando os tiros e detectando limites de tela
					tiro.update(cnv)
					if(tiro.outsideScreen(cnv)) tiros.splice(t, 1)
				}
			}
		}

		// Movimentando os asteroids, detectando limites de tela e colisões
		for(let a in asteroids){
			let asteroid = asteroids[a]
			let colidiuAsteroid = false
			let x, y

			if(asteroid){
				// Verificando colisão de asteroid com nave
				if(!nave.invincible){
					if(nave.collided(asteroid)){
						if(game.lifes > 0){
							game.lifes--
							nave.ghost()
						}else restart(GAMEOVERSTATUS)

						colidiuAsteroid = true
						x = nave.centerX()
						y = nave.centerY()
						
						createAudio(SOUNDS.BANGLARGE)
					}
				}

				if(colidiuAsteroid && game.played){
					if(asteroid.raio <= RAIOLIMITEASTEROID) asteroids.splice(a, 1)
					else asteroids.push(asteroid.duplicate(x, y))
				}else{
					asteroid.update(cnv)	
					if(asteroid.outsideScreen(cnv)) asteroids.splice(a, 1)
				}
			}
		}

		// Movimentando inimigos na tela, detectando limites de tela, dispando tiros contra o jogador e verificando outras colisões
		for(let i in inimigos){
			let inimigo = inimigos[i]

			if(inimigo){
				let m = Object.create(mouse)
				m.x = nave.centerX()
				m.y = nave.centerY()

				let c = Object.create(controller)
				c.top = (inimigo.y + inimigo.height >= cnv.height)
				c.bottom = (inimigo.y < 0)
				c.right = (inimigo.x < 0)
				c.left = (inimigo.x + inimigo.width >= cnv.width)

				inimigo.update(cnv, m, c)

				if(inimigo.outsideScreen(cnv)) inimigos.splice(i, 1)
				else if(!inimigo.outsideScreen(cnv)){
					if(game.turns % 10 === 0)
						tiros.push(inimigo.shoot(m, VELTIRO, RAIOTIRO, IMAGENS.TIROINIMIGO, SOUNDS.TIRO.cloneNode(true)))

					// Verificando colisão de nave com inimigo
					if(inimigo.collided(nave)){
						if(game.lifes > 0){
							game.lifes--
							nave.ghost()
						}else restart(GAMEOVERSTATUS)

						inimigos.splice(i, 1)

						createAudio(SOUNDS.BANGLARGE)
					}
				}
			}	
		}

		// Movimentando vidas geradas na tela e verificando colisão com o jogador
		for(let l in lifes){
			let life = lifes[l]
			let colidiuLife = false

			if(life){
				// Verificando colisão de vida com a nave
				if(nave.collided(life)){
					game.lifes++

					lifes.splice(l, 1)

					if(life.sound !== undefined && life.sound.play !== undefined) life.sound.play()
				}

				if(colidiuLife){
					lifes.splice(l, 1)
				}else{
					life.update(cnv)
					if(life.outsideScreen(cnv)) lifes.splice(l, 1)
				}
			}
		}

		// Movimentando a nave
		nave.update(cnv, mouse, controller)

		if(Math.round(Math.random() * 500) === 35) createInimigo()
		if(Math.round(Math.random() * 500) === 35) createLife()

		game.turns++
	}

	function loop(){
		draw()

		if(game.played) update()

		window.requestAnimationFrame(loop, cnv)
	}
})()