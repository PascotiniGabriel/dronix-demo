import { useMemo } from 'react'
import { MARCAS_DRONE, type MarcaDrone, type ModeloDrone, type Produto } from '@/types'
import { useStore } from './index'

/** Marcas que a revenda atende (Configurações). Sem escolha salva = todas. */
export function useMarcasAtivas(): MarcaDrone[] {
  const salvas = useStore((s) => s.empresa.marcasAtivas)
  return useMemo(() => (salvas && salvas.length ? MARCAS_DRONE.filter((m) => salvas.includes(m)) : MARCAS_DRONE), [salvas])
}

/** Modelos das marcas ativas (marcas desligadas somem das listas). */
export function useModelosAtivos(): ModeloDrone[] {
  const modelos = useStore((s) => s.modelos)
  const ativas = useMarcasAtivas()
  return useMemo(() => modelos.filter((m) => ativas.includes(m.marca)), [modelos, ativas])
}

export const marcaDoModelo = (id: string | undefined, modelos: ModeloDrone[]): MarcaDrone | undefined =>
  id ? modelos.find((m) => m.id === id)?.marca : undefined

/** "DJI T40", "XAG P100 Pro". */
export function nomeModeloCompleto(id: string, modelos?: ModeloDrone[]): string {
  const lista = modelos ?? useStore.getState().modelos
  const m = lista.find((x) => x.id === id)
  return m ? `${m.marca === 'Outra marca' ? '' : `${m.marca} `}${m.nome}` : id.toUpperCase()
}

/** Peça universal (sem marca) aparece sempre; a de marca desligada some. */
export const produtoAtivo = (p: Produto, ativas: MarcaDrone[]): boolean => !p.marca || ativas.includes(p.marca)
