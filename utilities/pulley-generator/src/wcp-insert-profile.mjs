// One 30-degree sector of the WCP-1121 1/2-inch hex-to-3D-print adapter.
// Coordinates were sampled from WCP's published STEP model and mirrored by
// rotational repetition. The full insert is 25.4 mm OD and 6.35 mm wide.
// https://ctre.download/wcp/cad/WCP-1121.step
const sector=[
  [8.50015,-2.27761],[8.62486,-1.9799],[8.81583,-1.73459],
  [9.06342,-1.54657],[9.3626,-1.42544],[9.64727,-1.38825],
  [11.97037,-1.38726],[12.2985,-1.29307],[12.51971,-1.10531],
  [12.65311,-.84764],[12.69985,.06169],[12.64417,.87622],
  [12.50546,1.12267],[12.28535,1.30024],[11.96289,1.38759],
  [9.64727,1.38825],[9.3626,1.42544],[9.06342,1.54657],
  [8.81583,1.73459],[8.61883,1.99027],[8.50015,2.27761],
];

export const WCP_INSERT_WIDTH=6.35;
export const WCP_INSERT_POCKET_DEPTH=6.5;
export const WCP_INSERT_OUTER_RADIUS=12.7;
export const WCP_INSERT_LEAD_IN=0.4;
export const WCP_INSERT_LEAD_IN_EXTRA=0.2;

function adjusted([x,y],radialAllowance,angle){
  const radius=Math.hypot(x,y);
  const scale=(radius+radialAllowance)/radius;
  const c=Math.cos(angle),s=Math.sin(angle);
  return [(x*c-y*s)*scale,(x*s+y*c)*scale];
}

export function wcpInsertProfile(radialAllowance=0){
  const points=[];
  for(let tooth=0;tooth<12;tooth++){
    const angle=tooth*Math.PI/6;
    for(const [index,[x,y]] of sector.entries()){
      if(tooth>0&&index===0)continue;
      points.push(adjusted([x,y],radialAllowance,angle));
    }
  }
  points.pop();
  return points;
}

// The sampled profile above is useful for diagrams and verification. CAD uses
// the same critical points as circular arcs and straight flanks, which keeps
// the exported solid compact and makes browser-side boolean cuts practical.
export function wcpInsertOutline(radialAllowance=0){
  const start=adjusted(sector[0],radialAllowance,0);
  const commands=[];
  for(let tooth=0;tooth<12;tooth++){
    const angle=tooth*Math.PI/6;
    commands.push(
      {type:'arc',via:adjusted(sector[2],radialAllowance,angle),to:adjusted(sector[5],radialAllowance,angle)},
      {type:'line',to:adjusted(sector[6],radialAllowance,angle)},
      {type:'arc',via:adjusted(sector[10],radialAllowance,angle),to:adjusted(sector[14],radialAllowance,angle)},
      {type:'line',to:adjusted(sector[15],radialAllowance,angle)},
      {type:'arc',via:adjusted(sector[18],radialAllowance,angle),to:adjusted(sector[0],radialAllowance,angle+Math.PI/6)},
    );
  }
  return {start,commands};
}
