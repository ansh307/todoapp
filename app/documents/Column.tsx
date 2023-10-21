import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { Draggable, Droppable } from "react-beautiful-dnd"

interface Props {
    column: {
      id: string;
      title: string;
      taskIds: number[];
    };
    tasks: Array<{
      id: number;
      content: string;
    }>;
  }

function Column({ column, tasks }: Props) {
    return (
        <Flex
            rounded="3px"
            bg="#36454F"
            w="400px"
            h="620px"
            flexDir="column"
        >
            <Flex
                align="center"
                h="60px"
                bg="#71797E"
                rounded="3px 3px 0 0"
                px="1.5rem"
                mb="1.5rem"
            >
                <Text
                    fontSize="17px"
                    fontWeight={600}
                    color="white"
                >
                    {column.title}
                </Text>
            </Flex>

            <Droppable droppableId={column.id}>
                {(droppableProvided, droppableSnapshot) => (
                    <Flex
                        px="1.5rem"
                        flex={1}
                        flexDir="column"
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                    >
                        {tasks.map((task , index) => (
                              <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                                {(draggableProvided , draggableSnapshot) => (
                                    <Flex
                         
                                        mb="1rem"
                                        h="72px"
                                        bg="#71797E"
                                        rounded="3px"
                                        p="1.5rem"
                                        ref={draggableProvided.innerRef}
                                        {...draggableProvided.draggableProps}
                                        {...draggableProvided.dragHandleProps}
                                    >
                                        <Text>{task.content}</Text>
                                    </Flex>
                                )}

                              </Draggable>
                        ))}

                    </Flex>
                )}

            </Droppable>

        </Flex>
    )
}

export default Column
