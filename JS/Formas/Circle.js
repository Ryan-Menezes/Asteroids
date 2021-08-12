class Circle{
	constructor(x, y, raio, img){
		this.x = x
		this.y = y
		this.raio = raio
		this.img = img
	}

	diameter(){
		return this.raio * 2
	}

	halfWidth(){
		return this.raio
	}

	halfHeight(){
		return this.raio
	}

	centerX(){
		return this.x + this.raio
	}

	centerY(){
		return this.y + this.raio
	}

	distanceX(x){
		return this.centerX() - x
	}

	distanceY(y){
		return this.centerY() - y
	}

	outsideScreen(cnv){
		return (this.x < -this.diameter() || this.y < -this.diameter() || this.x > cnv.width || this.y > cnv.height)
	}
	
	collided(obj){
		let catX = this.distanceX(obj.centerX())
		let catY = this.distanceY(obj.centerY())

		let distance = Math.hypot(Math.abs(catX), Math.abs(catY))
		let sumHalfSize = this.raio + obj.raio
		
		return (sumHalfSize > distance)
	}

	draw(ctx){}
	update(cnv){}
}