class Character{
  constructor(armatureDisplay,x,y){
    this.armature=armatureDisplay;
    this.armature.x=x;
    this.armature.y=y;
    this.direction=false;
    this.speedX=2;
    this.isRun=false;
    this.isIdle=false;
    this.isAttack=false;
    this._isRunNewAnimation=false;
    this.canMove=false;
    //腳色在地圖最右邊邊界
    this.isAtRightLimit=false;
    //腳色在地圖最左邊邊界
    this.isAtLeftLimit=false;
  }
  clearAllAnimationState=function()
  {
    this.isRun=false;
    this.isIdle=false;
    this.isAttack=false;
  }
  doAttackAnimation=function(animationName){
    if(this.isAttack)
      return;
    this.clearAllAnimationState();
    this.isAttack=true;
    this.armature.animation.play(animationName,1);
    this.armature.on(dragonBones.EventObject.COMPLETE, ()=>{
      this.isAttack=false;
    }, this);
  }
  runRunAnimation=function(){
    if(this.isRun)
      return;
    this.clearAllAnimationState();
    this.isRun=true;
    this.armature.animation.play("Run");
  }
  runIdleAnimation=function(){
    if(this.isIdle)
      return;
    this.clearAllAnimationState();
    this.isIdle=true;
    this.armature.animation.play("Idle");
  }
  setDirection=function(newDirection){
    if(newDirection!=this.direction)
      this.armature.scale.x=0-this.armature.scale.x;
    this.direction=newDirection;
  }
  _update=function(){
    if(this.isRun && this.canMove)
    {
      if(this.direction)
        this.armature.x-=this.speedX;
      else
        this.armature.x+=this.speedX;
    }

    if((this.armature.x<=400 && this.isAtRightLimit) ||
      (this.armature.x>400 && this.isAtLeftLimit))
    {
      this.canMove=false;
      this.isAtRightLimit=false;
      this.isAtLeftLimit=false;
    }
    
    if(!this.isRun && !this.isAttack)
      this.runIdleAnimation();
  }
}