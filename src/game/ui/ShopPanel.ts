import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { formatCoinsLabel, getCoins } from '../coins';
import {
  equipSkin,
  getEquippedSkinId,
  isSkinOwned,
  PLAYER_SKINS,
  purchaseSkin,
  type PlayerSkinDefinition,
} from '../playerSkins';
import { createMenuButton } from './MenuButtons';
import { playSfx } from '../audioManager';

const SCROLL_TOP = 150;
const SCROLL_HEIGHT = 500;
const CARD_HEIGHT = 108;
const CARD_GAP = 10;
const TAB_Y = 108;

export interface ShopPanelOptions {
  onBack: () => void;
}

export interface ShopPanelResult {
  root: Phaser.GameObjects.Container;
  destroy: () => void;
}

type SkinCardAction = 'buy' | 'equip' | 'equipped' | 'locked';

function getSkinAction(skin: PlayerSkinDefinition): SkinCardAction {
  const equippedId = getEquippedSkinId();
  if (equippedId === skin.id) return 'equipped';
  if (isSkinOwned(skin.id)) return 'equip';
  return 'buy';
}

function getActionLabel(skin: PlayerSkinDefinition, action: SkinCardAction): string {
  switch (action) {
    case 'equipped':
      return 'EQUIPPED';
    case 'equip':
      return 'EQUIP';
    case 'buy':
      return skin.price === 0 ? 'FREE' : `BUY ${skin.price}`;
    default:
      return 'LOCKED';
  }
}

function getActionColor(action: SkinCardAction, affordable: boolean): number {
  if (action === 'equipped') return 0x33aa66;
  if (action === 'equip') return 0x00d4ff;
  if (action === 'buy' && affordable) return 0xffcc00;
  return 0x556677;
}

function createSkinCard(
  scene: Phaser.Scene,
  skin: PlayerSkinDefinition,
  y: number,
  onAction: () => void,
): Phaser.GameObjects.Container {
  const card = scene.add.container(0, y);
  const cardH = CARD_HEIGHT - CARD_GAP;
  const action = getSkinAction(skin);
  const affordable = skin.price === 0 || getCoins() >= skin.price;
  const actionColor = getActionColor(action, affordable);
  const isEquipped = action === 'equipped';

  const bg = scene.add.graphics();
  const drawBg = () => {
    bg.clear();
    bg.fillStyle(0x12182a, 0.95);
    bg.fillRoundedRect(16, 0, GAME_WIDTH - 32, cardH, 8);
    bg.lineStyle(isEquipped ? 2 : 1, isEquipped ? 0x33aa66 : 0x223344, isEquipped ? 1 : 0.9);
    bg.strokeRoundedRect(16, 0, GAME_WIDTH - 32, cardH, 8);
  };
  drawBg();
  card.add(bg);

  const preview = scene.add.image(52, cardH / 2, skin.textureKey);
  preview.setScale(1.4);
  card.add(preview);

  const textX = 92;
  card.add(scene.add.text(textX, 12, skin.name, {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '13px',
    fontStyle: '700',
    color: '#00d4ff',
  }));

  card.add(scene.add.text(textX, 30, skin.description, {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '9px',
    color: '#8899aa',
    wordWrap: { width: GAME_WIDTH - textX - 110 },
  }));

  const priceLabel = skin.price === 0 ? 'Included' : `${skin.price} coins`;
  card.add(scene.add.text(textX, cardH - 22, priceLabel, {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '9px',
    fontStyle: '700',
    color: '#ffcc00',
  }));

  const actionLabel = getActionLabel(skin, action);
  const actionBtn = scene.add.container(GAME_WIDTH - 72, cardH / 2);
  const actionBg = scene.add.graphics();
  const drawActionBg = (fillAlpha: number) => {
    actionBg.clear();
    const enabled = action !== 'equipped' && (action !== 'buy' || affordable);
    actionBg.fillStyle(actionColor, enabled ? fillAlpha : 0.12);
    actionBg.fillRoundedRect(-42, -16, 84, 32, 8);
    actionBg.lineStyle(1, actionColor, enabled ? 0.9 : 0.35);
    actionBg.strokeRoundedRect(-42, -16, 84, 32, 8);
  };
  drawActionBg(0.2);

  const actionText = scene.add.text(0, 0, actionLabel, {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '10px',
    fontStyle: '700',
    color: `#${actionColor.toString(16).padStart(6, '0')}`,
  }).setOrigin(0.5);

  actionBtn.add([actionBg, actionText]);

  const canInteract = action !== 'equipped' && (action !== 'buy' || affordable);
  if (canInteract) {
    actionBtn.setInteractive(
      new Phaser.Geom.Rectangle(-42, -16, 84, 32),
      Phaser.Geom.Rectangle.Contains,
    );
    actionBtn.input!.cursor = 'pointer';
    actionBtn.on('pointerover', () => drawActionBg(0.35));
    actionBtn.on('pointerout', () => drawActionBg(0.2));
    actionBtn.on('pointerup', () => {
      playSfx('ui');
      onAction();
    });
  }

  card.add(actionBtn);
  return card;
}

export function createShopPanel(
  scene: Phaser.Scene,
  depth: number,
  options: ShopPanelOptions,
): ShopPanelResult {
  const root = scene.add.container(0, 0).setDepth(depth);

  root.add(scene.add.rectangle(
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2,
    GAME_WIDTH,
    GAME_HEIGHT,
    0x000000,
    0.85,
  ));

  root.add(scene.add.text(GAME_WIDTH / 2, 48, 'SHOP', {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '32px',
    fontStyle: '900',
    color: '#00d4ff',
  }).setOrigin(0.5));

  const coinsText = scene.add.text(GAME_WIDTH / 2, 78, formatCoinsLabel(), {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '14px',
    fontStyle: '700',
    color: '#ffcc00',
  }).setOrigin(0.5);
  root.add(coinsText);

  const tabBg = scene.add.graphics();
  tabBg.fillStyle(0x12182a, 0.9);
  tabBg.fillRoundedRect(24, TAB_Y - 22, 80, 44, 10);
  tabBg.lineStyle(2, 0x00d4ff, 1);
  tabBg.strokeRoundedRect(24, TAB_Y - 22, 80, 44, 10);
  root.add(tabBg);

  const tabIcon = scene.add.image(64, TAB_Y, 'shop-skins-tab-icon');
  tabIcon.setDisplaySize(28, 28);
  root.add(tabIcon);

  root.add(scene.add.text(112, TAB_Y, 'SKINS', {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '12px',
    fontStyle: '700',
    color: '#00d4ff',
  }).setOrigin(0, 0.5));

  const maskShape = scene.make.graphics({}, false);
  maskShape.fillStyle(0xffffff);
  maskShape.fillRect(0, SCROLL_TOP, GAME_WIDTH, SCROLL_HEIGHT);
  const mask = maskShape.createGeometryMask();

  const scrollViewport = scene.add.container(0, 0);
  scrollViewport.setMask(mask);
  root.add(scrollViewport);

  const content = scene.add.container(0, SCROLL_TOP);
  scrollViewport.add(content);

  let scrollY = 0;
  let dragging = false;
  let dragStartY = 0;
  let scrollStartY = 0;
  let maxScroll = 0;

  const applyScroll = () => {
    content.setY(SCROLL_TOP - scrollY);
  };

  const rebuildSkinList = () => {
    content.removeAll(true);
    coinsText.setText(formatCoinsLabel());

    let y = 0;
    for (const skin of PLAYER_SKINS) {
      const handleAction = () => {
        const action = getSkinAction(skin);
        if (action === 'buy') {
          if (!purchaseSkin(skin.id)) return;
        } else if (action === 'equip') {
          if (!equipSkin(skin.id)) return;
        } else {
          return;
        }
        rebuildSkinList();
      };

      content.add(createSkinCard(scene, skin, y, handleAction));
      y += CARD_HEIGHT;
    }

    maxScroll = Math.max(0, y - SCROLL_HEIGHT);
    scrollY = Phaser.Math.Clamp(scrollY, 0, maxScroll);
    applyScroll();
  };

  rebuildSkinList();

  const isInScrollArea = (pointer: Phaser.Input.Pointer) => (
    pointer.y >= SCROLL_TOP &&
    pointer.y <= SCROLL_TOP + SCROLL_HEIGHT &&
    pointer.x >= 0 &&
    pointer.x <= GAME_WIDTH
  );

  const onPointerDown = (pointer: Phaser.Input.Pointer) => {
    if (!isInScrollArea(pointer)) return;
    dragging = true;
    dragStartY = pointer.y;
    scrollStartY = scrollY;
  };

  const onPointerMove = (pointer: Phaser.Input.Pointer) => {
    if (!dragging) return;
    scrollY = Phaser.Math.Clamp(scrollStartY + (dragStartY - pointer.y), 0, maxScroll);
    applyScroll();
  };

  const stopDragging = () => {
    dragging = false;
  };

  scene.input.on('pointerdown', onPointerDown);
  scene.input.on('pointermove', onPointerMove);
  scene.input.on('pointerup', stopDragging);
  scene.input.on('pointerupoutside', stopDragging);

  const { container: backBtn } = createMenuButton(scene, {
    label: 'BACK',
    y: GAME_HEIGHT - 72,
    onClick: () => options.onBack(),
  });
  backBtn.setX(GAME_WIDTH / 2);
  root.add(backBtn);

  const destroy = () => {
    scene.input.off('pointerdown', onPointerDown);
    scene.input.off('pointermove', onPointerMove);
    scene.input.off('pointerup', stopDragging);
    scene.input.off('pointerupoutside', stopDragging);
    maskShape.destroy();
    root.destroy();
  };

  return { root, destroy };
}
