import Phaser from 'phaser';
import { isLevelUnlocked } from '../storyProgress';
import { getWorld1Level } from '../world1/levels';
import { getBackgroundTheme } from '../world1/backgrounds';
import {
  getWorld1MapNode,
  getWorld1MapRouteLevels,
  SUN_POSITION,
  WORLD1_MAP_NODES,
  WORLD1_ORBITS,
  type MapNodeStyle,
} from '../world1/mapLayout';

export interface SolarSystemMapConfig {
  viewportX: number;
  viewportY: number;
  viewportWidth: number;
  viewportHeight: number;
  initialLevel: number;
  onSelectLevel: (level: number) => void;
}

export interface SolarSystemMapHandle {
  container: Phaser.GameObjects.Container;
  setSelectedLevel: (level: number) => void;
  destroy: () => void;
}

const CONTENT_WIDTH = 780;
const CONTENT_HEIGHT = 560;
const MIN_ZOOM = 0.65;
const MAX_ZOOM = 2.2;

function mapToContent(nx: number, ny: number): { x: number; y: number } {
  return {
    x: -CONTENT_WIDTH / 2 + nx * CONTENT_WIDTH,
    y: -CONTENT_HEIGHT / 2 + ny * CONTENT_HEIGHT,
  };
}

function drawNodeShape(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  style: MapNodeStyle,
  color: number,
  alpha: number,
  radius: number,
): void {
  g.fillStyle(color, alpha);
  switch (style) {
    case 'star':
      g.fillCircle(x, y, radius + 2);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        g.fillTriangle(
          x + Math.cos(a) * (radius + 6),
          y + Math.sin(a) * (radius + 6),
          x + Math.cos(a + 0.25) * radius * 0.4,
          y + Math.sin(a + 0.25) * radius * 0.4,
          x + Math.cos(a - 0.25) * radius * 0.4,
          y + Math.sin(a - 0.25) * radius * 0.4,
        );
      }
      break;
    case 'asteroid':
      g.fillCircle(x - 2, y + 1, radius * 0.9);
      g.fillCircle(x + 3, y - 2, radius * 0.7);
      break;
    case 'moon':
      g.fillCircle(x, y, radius * 0.75);
      break;
    case 'planet':
    default:
      g.fillCircle(x, y, radius);
      g.fillStyle(0xffffff, alpha * 0.15);
      g.fillCircle(x - radius * 0.25, y - radius * 0.25, radius * 0.35);
      break;
  }
}

export function createSolarSystemMap(
  scene: Phaser.Scene,
  config: SolarSystemMapConfig,
): SolarSystemMapHandle {
  const { viewportX, viewportY, viewportWidth, viewportHeight, initialLevel, onSelectLevel } = config;

  let selectedLevel = initialLevel;
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let isPanning = false;
  let panStart = { x: 0, y: 0, panX: 0, panY: 0 };
  let pinchStartDistance = 0;
  let pinchStartScale = 1;

  const root = scene.add.container(viewportX, viewportY).setDepth(10);

  const frame = scene.add.graphics();
  frame.fillStyle(0x060810, 0.95);
  frame.fillRoundedRect(-viewportWidth / 2, -viewportHeight / 2, viewportWidth, viewportHeight, 12);
  frame.lineStyle(1, 0x223344, 0.8);
  frame.strokeRoundedRect(-viewportWidth / 2, -viewportHeight / 2, viewportWidth, viewportHeight, 12);
  root.add(frame);

  const maskShape = scene.make.graphics({}, false);
  maskShape.fillStyle(0xffffff);
  maskShape.fillRoundedRect(
    viewportX - viewportWidth / 2,
    viewportY - viewportHeight / 2,
    viewportWidth,
    viewportHeight,
    12,
  );
  const mask = maskShape.createGeometryMask();
  root.setMask(mask);

  const content = scene.add.container(0, 0);
  root.add(content);

  const selectionRing = scene.add.graphics();
  content.add(selectionRing);

  const sunPos = mapToContent(SUN_POSITION.x, SUN_POSITION.y);

  const orbits = scene.add.graphics();
  for (const orbit of WORLD1_ORBITS) {
    orbits.lineStyle(1, 0x334455, 0.35);
    orbits.strokeEllipse(
      sunPos.x,
      sunPos.y,
      orbit.rx * CONTENT_WIDTH * 2,
      orbit.ry * CONTENT_HEIGHT * 2,
    );
  }
  content.add(orbits);

  const sun = scene.add.graphics();
  sun.fillStyle(0xffaa22, 0.25);
  sun.fillCircle(sunPos.x, sunPos.y, 32);
  sun.fillStyle(0xffcc44, 0.95);
  sun.fillCircle(sunPos.x, sunPos.y, 18);
  sun.lineStyle(1, 0xffdd66, 0.6);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    sun.lineBetween(
      sunPos.x + Math.cos(a) * 22,
      sunPos.y + Math.sin(a) * 22,
      sunPos.x + Math.cos(a) * 32,
      sunPos.y + Math.sin(a) * 32,
    );
  }
  content.add(sun);

  const route = scene.add.graphics();
  const routeLevels = getWorld1MapRouteLevels();
  route.lineStyle(2, 0x00d4ff, 0.45);
  for (let i = 0; i < routeLevels.length - 1; i++) {
    const from = mapToContent(getWorld1MapNode(routeLevels[i]).x, getWorld1MapNode(routeLevels[i]).y);
    const to = mapToContent(getWorld1MapNode(routeLevels[i + 1]).x, getWorld1MapNode(routeLevels[i + 1]).y);
    const dist = Phaser.Math.Distance.Between(from.x, from.y, to.x, to.y);
    const steps = Math.max(6, Math.floor(dist / 10));
    for (let s = 0; s < steps; s += 2) {
      const t0 = s / steps;
      const t1 = Math.min((s + 1) / steps, 1);
      route.lineBetween(
        from.x + (to.x - from.x) * t0,
        from.y + (to.y - from.y) * t0,
        from.x + (to.x - from.x) * t1,
        from.y + (to.y - from.y) * t1,
      );
    }
  }
  content.add(route);

  const clampPan = (): void => {
    const halfW = (CONTENT_WIDTH * scale) / 2;
    const halfH = (CONTENT_HEIGHT * scale) / 2;
    const viewHalfW = viewportWidth / 2;
    const viewHalfH = viewportHeight / 2;
    const maxPanX = Math.max(0, halfW - viewHalfW * 0.4);
    const maxPanY = Math.max(0, halfH - viewHalfH * 0.4);
    panX = Phaser.Math.Clamp(panX, -maxPanX, maxPanX);
    panY = Phaser.Math.Clamp(panY, -maxPanY, maxPanY);
  };

  const applyTransform = (): void => {
    clampPan();
    content.setScale(scale);
    content.setPosition(panX, panY);
    redrawSelection();
  };

  const focusOnLevel = (level: number): void => {
    const node = getWorld1MapNode(level);
    const pos = mapToContent(node.x, node.y);
    panX = -pos.x * scale;
    panY = -pos.y * scale;
    applyTransform();
  };

  const redrawSelection = (): void => {
    selectionRing.clear();
    const node = getWorld1MapNode(selectedLevel);
    const pos = mapToContent(node.x, node.y);
    const theme = getBackgroundTheme(getWorld1Level(selectedLevel).themeId);
    selectionRing.lineStyle(3, theme.accentColor, 0.95);
    selectionRing.strokeCircle(pos.x, pos.y, 20);
  };

  const buildNode = (level: number): void => {
    const layout = getWorld1MapNode(level);
    const meta = getWorld1Level(level);
    const theme = getBackgroundTheme(meta.themeId);
    const unlocked = isLevelUnlocked(level);
    const pos = mapToContent(layout.x, layout.y);
    const nodeContainer = scene.add.container(pos.x, pos.y);

    const nodeGfx = scene.add.graphics();
    drawNodeShape(
      nodeGfx,
      0,
      0,
      layout.nodeStyle,
      theme.planetColor,
      unlocked ? 0.95 : 0.35,
      layout.nodeStyle === 'star' ? 10 : layout.nodeStyle === 'moon' ? 6 : 8,
    );
    nodeContainer.add(nodeGfx);

    const label = scene.add.text(0, 16, `${level}`, {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '10px',
      fontStyle: '700',
      color: unlocked ? '#ffffff' : '#556677',
    }).setOrigin(0.5);
    nodeContainer.add(label);

    nodeContainer.setInteractive(
      new Phaser.Geom.Rectangle(-18, -18, 36, 36),
      Phaser.Geom.Rectangle.Contains,
    );
    if (unlocked) {
      nodeContainer.input!.cursor = 'pointer';
    }

    nodeContainer.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation();
      isPanning = false;
    });
    nodeContainer.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation();
      selectedLevel = level;
      redrawSelection();
      onSelectLevel(level);
    });

    content.add(nodeContainer);
  };

  WORLD1_MAP_NODES.forEach((node) => buildNode(node.level));

  const panZone = scene.add.rectangle(0, 0, viewportWidth, viewportHeight, 0x000000, 0);
  panZone.setInteractive({ draggable: false });
  root.addAt(panZone, 0);

  panZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    if (pointer.leftButtonDown()) {
      isPanning = true;
      panStart = { x: pointer.x, y: pointer.y, panX, panY };
    }
  });

  const onPointerMove = (pointer: Phaser.Input.Pointer): void => {
    if (scene.input.pointer2.isDown && pinchStartDistance > 0) {
      const distance = Phaser.Math.Distance.Between(
        pointer.x,
        pointer.y,
        scene.input.pointer2.x,
        scene.input.pointer2.y,
      );
      scale = Phaser.Math.Clamp(pinchStartScale * (distance / pinchStartDistance), MIN_ZOOM, MAX_ZOOM);
      applyTransform();
      return;
    }

    if (!isPanning || !pointer.isDown) return;
    panX = panStart.panX + (pointer.x - panStart.x);
    panY = panStart.panY + (pointer.y - panStart.y);
    applyTransform();
  };

  const onPointerUp = (): void => {
    isPanning = false;
    pinchStartDistance = 0;
  };

  const onWheel = (
    _pointer: Phaser.Input.Pointer,
    _gameObjects: Phaser.GameObjects.GameObject[],
    _deltaX: number,
    deltaY: number,
  ): void => {
    const bounds = root.getBounds();
    const pointer = scene.input.activePointer;
    if (!bounds.contains(pointer.x, pointer.y)) return;

    const prevScale = scale;
    scale = Phaser.Math.Clamp(scale - deltaY * 0.0015, MIN_ZOOM, MAX_ZOOM);
    const ratio = scale / prevScale;
    panX *= ratio;
    panY *= ratio;
    applyTransform();
  };

  const onPinchStart = (pointer: Phaser.Input.Pointer): void => {
    if (!scene.input.pointer2.isDown) return;
    const bounds = root.getBounds();
    if (!bounds.contains(pointer.x, pointer.y)) return;
    pinchStartDistance = Phaser.Math.Distance.Between(
      pointer.x,
      pointer.y,
      scene.input.pointer2.x,
      scene.input.pointer2.y,
    );
    pinchStartScale = scale;
  };

  scene.input.on('pointermove', onPointerMove);
  scene.input.on('pointerup', onPointerUp);
  scene.input.on('wheel', onWheel);
  scene.input.on('pointerdown', onPinchStart);

  selectedLevel = initialLevel;
  scale = 1;
  focusOnLevel(initialLevel);
  redrawSelection();

  const hint = scene.add.text(0, viewportHeight / 2 - 18, 'Drag to pan  ·  Scroll/pinch to zoom', {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '8px',
    color: '#445566',
  }).setOrigin(0.5);
  root.add(hint);

  const destroy = (): void => {
    scene.input.off('pointermove', onPointerMove);
    scene.input.off('pointerup', onPointerUp);
    scene.input.off('wheel', onWheel);
    scene.input.off('pointerdown', onPinchStart);
    maskShape.destroy();
    root.destroy();
  };

  scene.events.once('shutdown', destroy);
  scene.events.once('destroy', destroy);

  return {
    container: root,
    setSelectedLevel: (level: number) => {
      selectedLevel = level;
      focusOnLevel(level);
      redrawSelection();
      onSelectLevel(level);
    },
    destroy,
  };
}
