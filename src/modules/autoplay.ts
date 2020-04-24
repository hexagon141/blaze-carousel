import type {Instance, RenderFunction, Settings} from '../blaze';

type Params = {
  speed: number
}

type Methods = {
  play: () => void,
  pause: () => void,
}

export function autoplay(
  render: RenderFunction,
  settings: Settings,
  instance: Instance,
  {speed = 1500}: Partial<Params> = {},
): Methods {
  let id: ReturnType<typeof setTimeout>;

  const play = () => {
    id = setInterval(() => {
      instance.position.current += settings.slideBy;
      render();
    }, speed);
  };

  const pause = () => clearInterval(id);

  play();

  return {
    play,
    pause,
  }
}