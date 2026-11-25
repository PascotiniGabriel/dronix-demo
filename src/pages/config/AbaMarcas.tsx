import { useStore } from '@/store'
import { useMarcasAtivas } from '@/store/marcas'
import { Painel, toast, cx } from '@/components/ui'
import { MARCAS_DRONE, type MarcaDrone } from '@/types'

/** Liga e desliga as marcas que a revenda atende. Marca desligada some de estoque, catálogo, clientes, OS e painel (os dados continuam salvos). */
export function AbaMarcas() {
  const empresa = useStore((s) => s.empresa)
  const modelos = useStore((s) => s.modelos)
  const produtos = useStore((s) => s.produtos)
  const salvarEmpresa = useStore((s) => s.salvarEmpresa)
  const ativas = useMarcasAtivas()

  function alternar(m: MarcaDrone) {
    const liga = !ativas.includes(m)
    const proximas = liga ? MARCAS_DRONE.filter((x) => ativas.includes(x) || x === m) : ativas.filter((x) => x !== m)
    if (!proximas.length) { toast.erro('Deixe pelo menos uma marca ligada.'); return }
    salvarEmpresa({ ...empresa, marcasAtivas: proximas })
    toast.sucesso(liga ? `${m} ligada.` : `${m} desligada: some das listas.`)
  }

  return (
    <Painel titulo="Marcas que você revende">
      <p className="mb-4 text-sm text-mata-suave">Ligue só as marcas de drone que sua revenda atende. As desligadas somem de estoque, catálogo, clientes, ordens de serviço e painel. Nada é apagado: ao ligar de novo, tudo volta.</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {MARCAS_DRONE.map((m) => {
          const ligada = ativas.includes(m)
          const nModelos = modelos.filter((x) => x.marca === m).length
          const nPecas = produtos.filter((p) => p.marca === m).length
          return (
            <li key={m}>
              <button
                type="button" role="switch" aria-checked={ligada} onClick={() => alternar(m)}
                className={cx('flex min-h-14 w-full items-center justify-between gap-3 rounded-painel border px-4 py-2 text-left', ligada ? 'border-lavoura bg-lavoura/5' : 'border-linha bg-papel')}
              >
                <span>
                  <span className="block font-medium">{m}</span>
                  <span className="block text-xs text-mata-suave">{nModelos} {nModelos === 1 ? 'modelo' : 'modelos'} · {nPecas} {nPecas === 1 ? 'item' : 'itens'} no estoque</span>
                </span>
                <span aria-hidden className={cx('relative h-6 w-11 shrink-0 rounded-full transition-colors motion-reduce:transition-none', ligada ? 'bg-lavoura' : 'bg-linha')}>
                  <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all motion-reduce:transition-none', ligada ? 'left-[22px]' : 'left-0.5')} />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </Painel>
  )
}
