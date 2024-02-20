import React, { ReactNode, createContext, useReducer, useState } from "react";
 // Certifique-se de importar Cycle e CyclesState corretamente
import { ActionTypes, Cycle, CycleReducer} from "../reducers/cycles";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CycleContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number;
  setSecondsPassed: (seconds: number) => void;
  CreateNewCycle: (data: CreateCycleData) => void;
  interruptedCurrentCycle: () => void;
}

interface CyclesContextProviderProps {
  children: ReactNode;
}

export const CycleContext = createContext({} as CycleContextType);

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  // Estado para armazenar os ciclos de trabalho
  const [cyclesState, dispatch] = useReducer(CycleReducer, { cycles: [], activeCycleId: null });

  // Estado para armazenar a quantidade de segundos passados
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  // Função para marcar o ciclo atual como terminado
  function markCurrentCycleAsFinished() {
    dispatch({
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
      payload: {
        activeCycleId
      },
    });
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function CreateNewCycle(data: CreateCycleData) {
    // Gera um ID para o novo ciclo
    const id = String(new Date().getTime())
    // Cria um novo ciclo com os dados do formulário
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    dispatch({
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: {
        newCycle
      }
    });

    // Reinicia a contagem de segundos passados
    setAmountSecondsPassed(0);
  }

  // Função para interromper o ciclo de trabalho
  function interruptedCurrentCycle() {
    dispatch({
      type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
      payload: {
        activeCycleId
      },
    });
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        CreateNewCycle,
        interruptedCurrentCycle
      }}
    >
      {children}
    </CycleContext.Provider>
  );
}