import { RenderSceneProps } from '../../types';

export default function AutonomousScene({ next }: RenderSceneProps) {
   return <>{next()}</>;
}
