import {FC, useEffect, useMemo, useState} from "react";
import {SignIn} from "@/features/sign-in";
import {Layout, theme} from "antd";
import Particles, {initParticlesEngine} from "@tsparticles/react";
import {MoveDirection, OutMode} from "@tsparticles/engine";
import {loadSlim} from "@tsparticles/slim";

const LoginPage: FC = () => {
  const [init, setInit] = useState(false);

  const {
    token: {colorBgLayout, colorText}
  } = theme.useToken();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(() => {
    return {
      background: {
        color: {
          value: colorBgLayout,
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          repulse: {
            distance: 80,
            duration: 0.1,
          },
        },
      },
      particles: {
        color: {
          value: colorText,
        },
        links: {
          color: colorText,
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {default: OutMode.out},
          random: false,
          speed: 0.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
            factor: 1000
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }
  }, [colorBgLayout, colorText])

  return (
    <Layout style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
      {init && <Particles id="tsparticles" options={options}/>}
      <SignIn style={{width: 300}}/>
    </Layout>
  );
};

export default LoginPage;