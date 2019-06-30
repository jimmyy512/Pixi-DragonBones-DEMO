var app;
var isFullScreen = false;
var RAF_then = 0;
var armatureDisplay;
var character;
var map;
var map2;

const MAX_FPS = 60;
const allClothSlots = [
  "UpBody",
  "DownBody",
  "RightBigLeg",
  "RightCalf",
  "RightFoot",
  "LeftBigLeg",
  "LeftCalf",
  "LeftFoot",
  "LeftUpArm",
  "LeftDownArm",
  "RightUpArm",
  "RightDownArm"
];

const attackAnimations=[
  "DragonAttack1",
  "DragonAttack2",
  "DragonAttack3",
  "DragonSkill1",
  "DragonSkill2",
  "DragonSkill3"
]

const attack2Animations=[
  "NormalAttack1",
  "NormalAttack2",
  "NormalAttack3",
  "NormalSkill1",
  "NormalSkill2",
  "NormalSkill3"
]

const attack3Animations=[
  "Taiji",
  "Taiji2",
  "Taiji3"
]
var screenWidthJudge = function() {
  let deviceWidth = document.body.offsetWidth + document.body.scrollLeft;
  let rotateTip = document.querySelector("#RotateTip");
  if (deviceWidth < 755) rotateTip.style.display = "block";
  else rotateTip.style.display = "none";
};

var resources = [];
resources.push(
  // "resources/character/character_ske.json",
  "resources/character/character_ske.dbbin",
  "resources/character/character_tex.json",
  "resources/character/character_tex.png",
  "resources/ui/Clicked_Move.png",
  "resources/ui/UNClicked_Move.png",
  "resources/map/city.png",
  "resources/map/map2.png",
  "resources/ui/Button.png",
  "resources/ui/attack.png",
  "resources/ui/attack2.png",
  "resources/ui/attack3.png"
);

window.onresize = function() {
  screenWidthJudge();
};
window.onload = () => {
  screenWidthJudge();
  app = new PIXI.Application({
    width: 800,
    height: 453,
    backgroundColor: 0x1099bb
  });
  document.body.appendChild(app.view);

  app.stage.interactive = true;
  app.ticker.add(() => {
    let fpsInterVal = 1000 / MAX_FPS;
    let now = Date.now();
    let elapesd = now - RAF_then;
    if (elapesd > fpsInterVal) {
      if (character !== undefined) character._update();
      if (map !== undefined) map._update(character);
      if (map2 !== undefined) map2._update(character);
      RAF_then = now - (elapesd % fpsInterVal);
    }
  });
  app.stage.on("pointerdown", () => {
    //網頁全螢幕效果
    // if(!isFullScreen)
    // {
    //   setTimeout(()=>{
    //     toggleFullScreen();
    //   },100);
    // }
  });
  loadResources();
};

//加載資源
var loadResources = function() {
  //PIXI loader'預加載'各種資源
  const binaryOptions = {
    loadType: PIXI.Loader.Resource.LOAD_TYPE.XHR,
    xhrType: PIXI.Loader.Resource.XHR_RESPONSE_TYPE.BUFFER
  };
  for (const resource of resources) {
    if (resource.indexOf("dbbin") > 0)
      PIXI.Loader.shared.add(resource, resource, binaryOptions);
    else PIXI.Loader.shared.add(resource, resource);
  }

  //當各種資源'預加載'完成時
  PIXI.Loader.shared.once("complete", (loader, resources) => {
    //背景地圖

    map2 = new Map(resources["resources/map/map2.png"].texture,-400,0, 0.7);
    map2.sprite.anchor.set(0, 0.2);
    map2.sprite.position.set(0, 0);
    app.stage.addChild(map2.sprite);

    map =  new Map(resources["resources/map/city.png"].texture,-700,0, 1.2);
    map.sprite.anchor.set(0, 0.2);
    map.sprite.position.set(0, 0);
    app.stage.addChild(map.sprite);

    const factory = dragonBones.PixiFactory.factory;
    //工廠加載龍骨骨骼資源
    factory.parseDragonBonesData(
      // resources["resources/character/character_ske.json"].data
      resources["resources/character/character_ske.dbbin"].data
    );
    //工廠加載龍骨圖片資源
    factory.parseTextureAtlasData(
      resources["resources/character/character_tex.json"].data,
      resources["resources/character/character_tex.png"].texture
    );
    //工廠產生動畫實例
    armatureDisplay = factory.buildArmatureDisplay("MainCharacter");
    character = new Character(armatureDisplay, 400, 430);
    //播放跑步動畫
    character.armature.animation.play("Run");
    //動畫大小縮放0.5
    character.armature.scale.x = 0.4;
    character.armature.scale.y = 0.4;
    //把角色加到場景上
    app.stage.addChild(character.armature);

    //left button
    let leftButton = new Button(
      resources["resources/ui/UNClicked_Move.png"].texture,
      resources["resources/ui/Clicked_Move.png"].texture
    );
    leftButton.scale.set(0.7);
    leftButton.x = 0 + leftButton.width / 2;
    leftButton.y = app.renderer.screen.height - leftButton.height / 2;
    leftButton.on("pointerdown", () => {
      character.setDirection(true);
      character.runRunAnimation();
    });
    leftButton.on("pointerup", () => {
      character.clearAllAnimationState();
    });
    leftButton.on("pointerout", () => {
      character.clearAllAnimationState();
    });
    app.stage.addChild(leftButton);

    //right button
    let rightButton = new Button(
      resources["resources/ui/UNClicked_Move.png"].texture,
      resources["resources/ui/Clicked_Move.png"].texture
    );
    rightButton.scale.set(0.7);
    rightButton.x = 0 + rightButton.width * 1.7;
    rightButton.scale.x = 0 - rightButton.scale.x;
    rightButton.y = leftButton.y;
    rightButton.on("pointerdown", () => {
      character.setDirection(false);
      character.runRunAnimation();
    });
    rightButton.on("pointerup", () => {
      character.clearAllAnimationState();
    });
    rightButton.on("pointerout", () => {
      character.clearAllAnimationState();
    });
    app.stage.addChild(rightButton);

    //body change btn
    let bodyChangeBtn = new TextButton(
      resources["resources/ui/Button.png"].texture,
      "換裝"
    );
    bodyChangeBtn.position.set(700, 50);
    bodyChangeBtn.scale.set(1.4);
    bodyChangeBtn.on("pointerdown", randCloth);
    app.stage.addChild(bodyChangeBtn);

    //hair change btn
    let hairChangeBtn = new TextButton(
      resources["resources/ui/Button.png"].texture,
      "換髮"
    );
    hairChangeBtn.position.set(700, 100);
    hairChangeBtn.scale.set(1.4);
    hairChangeBtn.on("pointerdown", randHair);
    app.stage.addChild(hairChangeBtn);

    //attack btn
    let attackBtn = new TextButton(
      resources["resources/ui/attack.png"].texture
    );
    attackBtn.x = app.renderer.screen.width - attackBtn.width / 2;
    attackBtn.y = app.renderer.screen.height - attackBtn.height / 2;
    attackBtn.on("pointerdown", randAttack2);
    app.stage.addChild(attackBtn);

    //attack2 btn
    let attack2Btn = new TextButton(
      resources["resources/ui/attack2.png"].texture
    );
    attack2Btn.x = app.renderer.screen.width - attack2Btn.width*1.5;
    attack2Btn.y = app.renderer.screen.height - attack2Btn.height / 2;
    attack2Btn.on("pointerdown", randAttack);
    app.stage.addChild(attack2Btn);

    //attack3 btn
    let attack3Btn = new TextButton(
      resources["resources/ui/attack3.png"].texture
    );
    attack3Btn.x = app.renderer.screen.width - attack3Btn.width/2;
    attack3Btn.y = app.renderer.screen.height - attack3Btn.height*1.5;
    attack3Btn.on("pointerdown", randAttack3);
    app.stage.addChild(attack3Btn);
  });
  PIXI.Loader.shared.load();
};


function randAttack(){
  let randIndex = Math.floor(Math.random() * attackAnimations.length);
  character.doAttackAnimation(attackAnimations[randIndex]);
}

function randAttack2(){
  let randIndex = Math.floor(Math.random() * attack2Animations.length);
  character.doAttackAnimation(attack2Animations[randIndex]);
}

function randAttack3(){
  let randIndex = Math.floor(Math.random() * attack2Animations.length);
  character.doAttackAnimation(attack3Animations[randIndex]);
}


function randCloth() {
  let randIndex = Math.floor(Math.random() * 5);
  allClothSlots.forEach(it => {
    character.armature.armature.getSlot(it).displayIndex = randIndex;
  });
}

function randHair() {
  let randIndex = Math.floor(Math.random() * 4);
  character.armature.armature.getSlot("Hair").displayIndex = randIndex;
}
// //手機轉向判斷
// window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", ()=> {
//   if (window.orientation === 180 || window.orientation === 0)
//     isFullScreen=false;

//   //手機直向
//   //if (window.orientation === 180 || window.orientation === 0)
//   //手機橫向
//   // if (window.orientation === 90 || window.orientation === -90 )
//   // document.querySelector('#RotateTip').style.display="block";
//   // document.querySelector('#RotateTip').style.display="none";
// }, false);

//canvas全螢幕
function toggleFullScreen() {
  let doc = window.document;
  let docEl = doc.querySelector("canvas");

  let requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  let cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    isFullScreen = true;
    requestFullScreen.call(docEl);
  } else {
    isFullScreen = false;
    cancelFullScreen.call(doc);
  }
}
