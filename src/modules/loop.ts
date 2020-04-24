import {Instance, RenderFunction, Settings} from '../blaze';

export function loop(
  render: RenderFunction,
  settings: Settings,
  instance: Instance,
): void {
  const head = document.createDocumentFragment();
  const tail = document.createDocumentFragment();

  for (let i = 0; i < settings.items; i++) {
    head.insertBefore(
      instance.inner.children[instance.inner.children.length - i - 1].cloneNode(true),
      head.firstChild,
    );

    tail.appendChild(instance.inner.children[i].cloneNode(true));
  }

  instance.inner.insertBefore(head, instance.inner.firstChild);
  instance.inner.appendChild(tail);

  instance.inner.addEventListener('transitionstart', () => instance.processing = true);
  instance.inner.addEventListener('transitionend', () => {
    instance.processing = false;

    const reached = {
      left: instance.position.current === instance.position.min,
      right: instance.position.current === instance.position.max,
    };

    if (reached.left || reached.right) {
      if (reached.left) {
        instance.position.current = instance.inner.children.length - settings.items * 2;
      }

      if (reached.right) {
        instance.position.current = settings.items;
      }

      render({
        mode: 'silent',
      });
    }
  });
}