import React, { useCallback } from "react";

import { ReactFlow, Handle, Position, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box, Flex, Text, Tag, Stack } from "@chakra-ui/react";

import Card from "components/card/Card";

const LinkRedirectChart = ({ data, ...rest }) => {
  console.log("Data received:", data);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card
        p="20px"
        align="center"
        w="100%"
        {...rest}
        h="auto"
        boxShadow="lg"
      >
        <Text fontSize="xl" fontWeight="bold" color="gray.400">
          No redirect chain data available
        </Text>
      </Card>
    );
  }

  const generateFlowData = (redirectChain) => {
    const nodes = redirectChain.map((redirect, index) => ({
      id: `${index}`,
      position: { x: index * 300, y: 100 },
      data: {
        label: `URL: ${redirect.url}\nDuration: ${redirect.duration}ms\nSame Domain: ${
          redirect.sameDomain ? "Yes" : "No"
        }`,
      },
      style: {
        backgroundColor: redirect.sameDomain ? "#FFD700" : "#FF6347",
        color: "white",
        fontWeight: "bold",
        border: "2px solid black",
        borderRadius: "5px",
      },
    }));

    const edges = redirectChain.slice(0, -1).map((redirect, index) => ({
      id: `e${index}-${index + 1}`,
      source: `${index}`,
      target: `${index + 1}`,
      label: `Duration: ${redirectChain[index + 1].duration}ms`,
      animated: true,
      style: { stroke: "#000" },
      labelStyle: { fill: "#000", fontWeight: "bold" },
      markerEnd: {
        type: "arrowclosed",
        color: "#000",
      },
    }));

    return { nodes, edges };
  };

  return (
    <Stack spacing={8} {...rest}>
      {data.map((entry, index) => {
        const { redirectChain } = entry;
        if (!redirectChain || redirectChain.length === 0) return null;

        const { nodes, edges } = generateFlowData(redirectChain);

        return (
          <Card
            key={index}
            p="20px"
            align="center"
            w="100%"
            h="auto"
            boxShadow="lg"
          >
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Redirect Chain {index + 1}
            </Text>
            <Box w="100%" h="500px" border="1px solid #e2e8f0" borderRadius="md">
              <ReactFlow nodes={nodes} edges={edges} fitView>
                <MiniMap />
                <Controls />
                <Background color="#ddd" gap={16} />
              </ReactFlow>
            </Box>
            <Box mt={4} w="100%">
              <Tag colorScheme="blue">Total Links: {nodes.length}</Tag>
              <Tag colorScheme="green" ml={2}>
                Total Redirects: {edges.length}
              </Tag>
            </Box>
          </Card>
        );
      })}
    </Stack>
  );
};

export default LinkRedirectChart;