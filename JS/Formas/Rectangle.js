class Rectangle{
	constructor(x, y, width, height, img){
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.img = img
	}

	halfWidth(){
		return this.width / 2
	}

	halfHeight(){
		return this.height / 2
	}

	centerX(){
		return this.x + this.halfWidth()
	}

	centerY(){
		return this.y + this.halfHeight()
	}

	distanceX(x){
		return this.centerX() - x
	}

	distanceY(y){
		return this.centerY() - y
	}

	outsideScreen(cnv){
		return (this.x < -this.width || this.y < -this.height || this.x > cnv.width || this.y > cnv.height)
	}

	collided(obj){
		let catX = this.distanceX(obj.centerX())
		let catY = this.distanceY(obj.centerY())

		let sumHalfWidth = this.halfWidth() + obj.halfWidth()
		let sumHalfHeight = this.halfHeight() + obj.halfHeight()

		return (sumHalfHeight > Math.abs(catX) && sumHalfHeight > Math.abs(catY))
	}

	draw(ctx){}
	update(cnv, mouse, controller){}
}