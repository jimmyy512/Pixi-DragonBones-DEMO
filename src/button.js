class Button {
  constructor(unClickUrlTexture, clickUrlTexture, x = 0, y = 0) {
    this.btn = new PIXI.Sprite(unClickUrlTexture);
    this.btn.anchor.set(0.5);
    this.btn.x = x;
    this.btn.y = y;
    this.btn.buttonMode = true;
    this.btn.interactive = true;
    this.btn.on("pointerdown", () => {
      this.btn.texture = clickUrlTexture;
    });
    this.btn.on("pointerup", () => {
      this.btn.texture = unClickUrlTexture;
    });
    this.btn.on("pointerout", () => {
      this.btn.texture = unClickUrlTexture;
    });
    return this.btn;
  }
}

class TextButton {
  constructor(bgURlTexture, textString, x = 0, y = 0) {
    this.btn = new PIXI.Sprite(bgURlTexture);
    this.btn.anchor.set(0.5);
    this.btn.x = x;
    this.btn.y = y;
    this.btn.buttonMode = true;
    this.btn.interactive = true;
    const clickEffectOffset=0.2;
    const style = new PIXI.TextStyle({
        fill: "white",
        fontSize: 13,
        fontWeight: 600
    });
    this.text = new PIXI.Text(textString, style);
    this.text.anchor.set(0.5);
    this.btn.addChild(this.text);
    //click event
    this.btn.on("pointerdown", () => {
      this.btn.scale.x=this.btn.scale.x+clickEffectOffset;
      this.btn.scale.y=this.btn.scale.y+clickEffectOffset;
    });
    this.btn.on("pointerup", () => {
      this.btn.scale.x=this.btn.scale.x-clickEffectOffset;
      this.btn.scale.y=this.btn.scale.y-clickEffectOffset;
    });
    return this.btn;
  }
}

class shakeButton {
  constructor(bgURlTexture, x = 0, y = 0) {
    this.btn = new PIXI.Sprite(bgURlTexture);
    this.btn.anchor.set(0.5);
    this.btn.x = x;
    this.btn.y = y;
    this.btn.buttonMode = true;
    this.btn.interactive = true;
    const clickEffectOffset=0.2;
    
    //click event
    this.btn.on("pointerdown", () => {
      this.btn.scale.x=this.btn.scale.x+clickEffectOffset;
      this.btn.scale.y=this.btn.scale.y+clickEffectOffset;
    });
    this.btn.on("pointerup", () => {
      this.btn.scale.x=this.btn.scale.x-clickEffectOffset;
      this.btn.scale.y=this.btn.scale.y-clickEffectOffset;
    });
    return this.btn;
  }
}

