// @ts-ignore
import classes from './index.css';

export type Render = {
  mode?: 'default' | 'silent',
};

export type RenderFunction = (config?: Render) => void

export type Instance = {
  inner: HTMLElement,
  elementWidth: number,
  processing: boolean,
  position: {
    current: number,
    min: number,
    max: number,
  },
}

export type Module = undefined | {
  [key: string]: () => void
}

export type Settings = {
  items: number,
  slideBy: number,
  modules?: Array<{
    module: (
      render: (config: Render) => void,
      settings: Settings,
      instance: Instance,
      params: {
        [type in string | number]: number | string
      }
    ) => Module,
    config: {
      [key: string]: number | string
    }
  }>
}

export const cssVariables: {[key: string]: string} = {
  elementWidth: '--element-width',
  duration: '--duration',
  offset: '--offset',
};

export function blaze(outer: HTMLElement, settings: Settings) {
  const instance: Instance = {
    inner: document.createElement('div'),
    elementWidth: outer.offsetWidth / settings.items,
    processing: false,
    position: {
      current: 0,
      min: 0,
      max: outer.children.length + settings.items,
    },
  };

  outer.classList.add(classes.outer);
  instance.inner.classList.add(classes.inner);
  instance.inner.style.setProperty(
    cssVariables.elementWidth,
    100 / settings.items + '%'
  );

  const elements = document.createDocumentFragment();

  for (const element of Array.from(outer.children)) {
    const elementOuter = document.createElement('div');

    elementOuter.classList.add(classes.element);
    elementOuter.appendChild(element as Node);
    elements.appendChild(elementOuter);
  }

  instance.inner.appendChild(elements);
  outer.appendChild(instance.inner);

  let modules: Module = {};

  if (settings.modules) {
    for (const {module, config} of settings.modules) {
      const methods = module(render, settings, instance, config);

      if (methods) {
        modules = {
          ...modules,
          ...methods,
        };
      }
    }
  }

  render();

  function prev() {
    if (!instance.processing) {
      instance.position.current -= settings.slideBy;
      render();
    }
  }

  function next() {
    if (!instance.processing) {
      instance.position.current += settings.slideBy;
      render();
    }
  }

  function render({mode}: Render = {}) {
    if (mode === 'silent') {
      instance.inner.style.setProperty(cssVariables.duration, '0s');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          instance.inner.style.removeProperty(cssVariables.duration);
        })
      })
    }

    instance.inner.style.setProperty(
      cssVariables.offset,
      instance.position.current * instance.elementWidth + 'px'
    );
  }

  return {
    prev,
    next,
    ...modules,
  }
}