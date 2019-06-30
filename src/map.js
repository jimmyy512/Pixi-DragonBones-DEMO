class Map{
  constructor(spriteTexture,minX,maxX,moveOffset){
    this.sprite=new PIXI.Sprite(spriteTexture);
    this.moveOffset=moveOffset;
    this.minX=minX;
    this.maxX=maxX;
    return this;
  }
  _update=function(character){
    if(character.isRun)
    {
      if(this.sprite.x<=this.maxX && this.sprite.x>=this.minX)
      {
        if(!character.canMove)
        {
          if(character.direction)
            this.sprite.x+=character.speedX*this.moveOffset;
          else
            this.sprite.x-=character.speedX*this.moveOffset;
        }
      }
      else
      {
        if(this.sprite.x>this.maxX)
        {
          this.sprite.x=this.maxX;
          character.isAtLeftLimit=true;
        }
        else
        {
          this.sprite.x=this.minX;
          character.isAtRightLimit=true;
        }
        character.canMove=true;
      }
    }
  }
}