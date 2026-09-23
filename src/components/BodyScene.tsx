import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, Environment, Lightformer, ContactShadows } from "@react-three/drei";
import type { PontoCorpo, ExameCorpo } from "@/lib/data";

const PELE = "#F3A488";
const SOMBRA = "#E8714F";

function Parte({
  pos,
  args,
  rot = [0, 0, 0],
  cor = PELE,
}: {
  pos: [number, number, number];
  args: [number, number];
  rot?: [number, number, number];
  cor?: string;
}) {
  return (
    <mesh position={pos} rotation={rot} castShadow>
      <capsuleGeometry args={[args[0], args[1], 6, 20]} />
      <meshStandardMaterial color={cor} roughness={0.75} metalness={0.02} />
    </mesh>
  );
}

function Manequim() {
  return (
    <group>
      {/* cabeça */}
      <mesh position={[0, 1.66, 0]} castShadow>
        <sphereGeometry args={[0.125, 32, 32]} />
        <meshStandardMaterial color={PELE} roughness={0.75} />
      </mesh>
      {/* pescoço */}
      <Parte pos={[0, 1.5, 0]} args={[0.05, 0.08]} cor={SOMBRA} />
      {/* tronco */}
      <Parte pos={[0, 1.26, 0]} args={[0.155, 0.26]} />
      {/* quadril */}
      <Parte pos={[0, 1.0, 0]} args={[0.14, 0.1]} cor={SOMBRA} />
      {/* braços */}
      {[1, -1].map((s) => (
        <group key={s}>
          <Parte pos={[s * 0.21, 1.3, 0]} args={[0.048, 0.24]} rot={[0, 0, s * 0.08]} />
          <Parte pos={[s * 0.25, 1.02, 0]} args={[0.042, 0.24]} rot={[0, 0, s * 0.05]} cor={SOMBRA} />
          <mesh position={[s * 0.27, 0.85, 0]} castShadow>
            <sphereGeometry args={[0.05, 20, 20]} />
            <meshStandardMaterial color={PELE} roughness={0.8} />
          </mesh>
        </group>
      ))}
      {/* pernas */}
      {[1, -1].map((s) => (
        <group key={s}>
          <Parte pos={[s * 0.085, 0.7, 0]} args={[0.075, 0.3]} />
          <Parte pos={[s * 0.09, 0.32, 0]} args={[0.058, 0.28]} cor={SOMBRA} />
          <mesh position={[s * 0.09, 0.04, 0.04]} castShadow>
            <boxGeometry args={[0.1, 0.07, 0.2]} />
            <meshStandardMaterial color={PELE} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Marcador({
  ponto,
  aberto,
  selecionado,
  onToggle,
  onSelecionar,
}: {
  ponto: PontoCorpo;
  aberto: boolean;
  selecionado: ExameCorpo | null;
  onToggle: () => void;
  onSelecionar: (e: ExameCorpo) => void;
}) {
  return (
    <Html position={ponto.pos} center distanceFactor={2.2} zIndexRange={[20, 0]}>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          aria-label={`${ponto.parte}: ${ponto.exames.length} exames`}
          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs shadow-sm transition-colors ${
            aberto ? "bg-foreground text-background" : "bg-card/90 text-muted-foreground hover:bg-card"
          }`}
        >
          +{ponto.exames.length}
        </button>
        {aberto && (
          <div className="flex flex-col gap-2">
            {ponto.exames.map((e, i) => {
              const ativo = selecionado?.nome === e.nome && selecionado?.data === e.data;
              return (
                <button
                  key={i}
                  onClick={() => onSelecionar(e)}
                  className={`flex w-max items-center gap-3 whitespace-nowrap rounded-full px-4 py-2 text-xs transition-colors ${
                    ativo
                      ? "bg-foreground text-background"
                      : "bg-muted/90 text-muted-foreground hover:bg-border"
                  }`}
                >
                  <span>{e.nome}</span>
                  <span>{e.data}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Html>
  );
}

export default function BodyScene({
  pontos,
  aberto,
  selecionado,
  onToggle,
  onSelecionar,
}: {
  pontos: PontoCorpo[];
  aberto: string | null;
  selecionado: ExameCorpo | null;
  onToggle: (id: string) => void;
  onSelecionar: (e: ExameCorpo) => void;
}) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.1, 3.5], fov: 40 }}>
      <color attach="background" args={["#F6F6F6"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 6, 4]} intensity={1.4} castShadow />
      <Environment>
        <Lightformer intensity={1.6} position={[0, 4, 2]} scale={[8, 8, 1]} />
        <Lightformer intensity={0.8} color="#ffd9cc" position={[-4, 1, -2]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
      </Environment>
      <group position={[0, -0.85, 0]}>
        <Manequim />
        {pontos.map((p) => (
          <Marcador
            key={p.id}
            ponto={p}
            aberto={aberto === p.id}
            selecionado={selecionado}
            onToggle={() => onToggle(p.id)}
            onSelecionar={onSelecionar}
          />
        ))}
        <ContactShadows position={[0, 0, 0]} opacity={0.25} scale={3} blur={2.6} far={2} />
      </group>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.9}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
