import type {Instance, RenderFunction, Settings} from '../blaze';

type AutoplayConfig = {
  speed?: number,
}

type AutoplayApi = {
  play: () => void,
  pause: () => void,
}

const defaultConfig = {
  speed: 1500,
};

export function autoplay(
  render: RenderFunction,
  settings: Settings,
  instance: Instance,
  {speed}: AutoplayConfig = defaultConfig,
): AutoplayApi {
  let id: number;

  function play() {
    id = setInterval(() => {
      instance.position.current += settings.slideBy;
      render();
    }, speed);
  }

  function pause() {
    clearInterval(id)
  }

  play();

  return {
    play,
    pause,
  }
}