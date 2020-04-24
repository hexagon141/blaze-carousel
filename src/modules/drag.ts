import {cssVariables} from '../blaze';
import type {Instance, RenderFunction, Settings} from '../blaze';

type Params = {
  touch: boolean,
  mouse: boolean,
}

export function drag(
  render: RenderFunction,
  settings: Settings,
  instance: Instance,
  {touch, mouse}: Partial<Params> = {},
): void {
  if (touch) {
    instance.inner.addEventListener('touchstart', handleStart);
    instance.inner.addEventListener('touchmove', handleMove);
    instance.inner.addEventListener('touchend', handleFinish);
  }

  if (mouse) {
    instance.inner.addEventListener('mousedown', handleStart);
    instance.inner.addEventListener('mousemove', handleMove);
    instance.inner.addEventListener('mouseup', handleFinish);
  }

  let dragging = false;
  let coordinates = 0;
  let start = 0;

  function handleStart(event: TouchEvent | MouseEvent) {
    dragging = true;
    coordinates = capture(event);
    start = instance.position.current;
  }

  function handleMove(event: TouchEvent | MouseEvent) {
    if (dragging) {
      instance.inner.style.setProperty(cssVariables.duration, '0s');

      const moved = (coordinates - capture(event)) / instance.elementWidth;

      instance.position.current = start + moved;

      const reached = {
        left: Math.round(instance.position.current) === instance.position.min,
        right: Math.round(instance.position.current) === instance.position.max,
      };

      if (reached.left || reached.right) {
        if (reached.left) {
          instance.position.current = instance.position.current + instance.inner.children.length - settings.items * 2;
          start = instance.position.current - moved;
        }

        if (reached.right) {
          instance.position.current = settings.items - moved % 1;
          start = instance.position.current - moved;
        }

        render({
          mode: 'silent',
        });
      } else {
        render();
      }
    }
  }

  function handleFinish() {
    dragging = false;
    instance.position.current = Math.round(instance.position.current);
    instance.inner.style.removeProperty(cssVariables.duration);
    render();
  }
}

function capture(event: TouchEvent | MouseEvent) {
  return event instanceof TouchEvent ? event.touches[0].screenX : event.screenX;
}