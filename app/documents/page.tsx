"use client"
import React, { useState } from 'react';
import { Flex, Heading, Text } from "@chakra-ui/react";
// import Column from './Column';
const Column = dynamic(() => import("./Column"), { ssr: false })

import { DragDropContext } from 'react-beautiful-dnd';
import dynamic from 'next/dynamic';

// Define your data structures
interface Task {
  id: number;
  content: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: number[];
}

interface InitialData {
  tasks: { [taskId: number]: Task };
  columns: { [columnId: string]: Column };
  columnOrder: string[];
}

const reorderColumnList = (sourceCol: Column, startIndex: number, endIndex: number) => {
  const newTaskIds = Array.from(sourceCol.taskIds)
  const [removed] = newTaskIds.splice(startIndex , 1) 
  newTaskIds.splice(endIndex , 0, removed)

  const newColumn = {
    ...sourceCol,
    taskIds : newTaskIds
  }

  return newColumn
}

function Page() {
  // Define the type for your state using the InitialData interface
  const [state, setState] = useState<InitialData>(initialData);

  const onDragEnd = (result: any) => {
    const { destination, source } = result;
    // Add your logic here

    //if user tries to drop in an unknown destitnation
    if (!destination) return;

    //if user drags and drops back in the same position 
    if (destination.droppableId === source.droppableId &&
      destination.index === source.index) {
      return
    }

    // if the user within the same column but in different positon 
    const sourceCol = state.columns[source.droppableId]
    const destinationCol = state.columns[destination.droppableId]
    if(sourceCol.id === destinationCol.id){
      const newColumn = reorderColumnList(
        sourceCol ,
         source.index,
         destination.index
      )

      const newState = {
        ...state,
        columns : {
          ...state.columns,
          [newColumn.id] : newColumn
        }
      }
      setState(newState)
      return
    }

    // if the user moves from one column to another
    const startTaskIds = Array.from(sourceCol.taskIds)
    const [removed] = startTaskIds.splice(source.index , 1)
    const newStartCol = {
      ...sourceCol,
      taskIds : startTaskIds
    }

    const endTaskIds = Array.from(destinationCol.taskIds)
    endTaskIds.splice(destination.index , 0 , removed)

    const newEndCol = {
      ...destinationCol , 
      taskIds : endTaskIds
    }

    const newState = {
      ...state , 
      columns : {
        ...state.columns,
        [newStartCol.id] : newStartCol,
        [newEndCol.id] : newEndCol
      }
    }

    setState(newState)
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex flexDir="column" bg="black" minH="100vh" w="full" color="white" pb="2rem">
        <Flex py="4rem" flexDir="column" align="center">
          <Heading fontSize="3xl" fontWeight={600}>
            React
          </Heading>
          <Text fontSize="20px" fontWeight={600} color="gray.300">
            react dnd
          </Text>
        </Flex>
        <Flex justify="space-between" px="4rem">

          {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskIds.map(taskId => state.tasks[taskId]);

            return <Column key={column.id} column={column} tasks={tasks} />
          })}
        </Flex>
      </Flex>
    </DragDropContext>
  );
}

export default Page;

const initialData: InitialData = {
  tasks: {
    1: { id: 1, content: "To complete this todo app" },
    2: { id: 2, content: "To earn money" },
    3: { id: 3, content: "To make my app" },
    4: { id: 4, content: "To finalize company name" },
    5: { id: 5, content: "To go out to travel" },
    6: { id: 6, content: "To ride bicycle" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To-do",
      taskIds: [1, 2, 3, 4, 5, 6],
    },
    "column-2": {
      id: "column-2",
      title: "In-progress",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "Completed",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};


// 34