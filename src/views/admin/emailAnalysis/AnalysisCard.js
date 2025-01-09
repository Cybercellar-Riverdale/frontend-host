import React from "react";
import {
  Box,
  Flex,
  Text,
  Progress,
  Tag,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from "@chakra-ui/react";

import Card from "components/card/Card";

const AnalysisCard = ({ data, ...rest }) => {

  if (!data) {
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
          No data available
        </Text>
      </Card>
    );
  }
  



    const {url, severityScore, severity, category, stats = {} } = data;
    
    const severityColors = {
      Low: "green.300",
      Medium: "yellow.300",
      High: "red.300",
      Critical: "red.600",
    };

    return (
      <Card p="20px"
      align="center"
      w="100%"
      {...rest}
      h="auto"
      boxShadow="lg"
    >

      {/* URL */}
      <Text fontSize="xl" fontWeight="bold" isTruncated>
        {url}
      </Text>

      {/* Severity and Category */}
      <Flex mt={2} align="center" justify="space-between">
        <Tag colorScheme="teal" size="md">
          {category}
        </Tag>
        <Tag
          size="md"
          bg={severityColors[severity] || "gray.500"}
          color="white"
        >
          {severity}
        </Tag>
      </Flex>

      {/* Severity Score Progress */}
      <Text mt={4} fontSize="sm" color="gray.400">
        Severity Score
      </Text>
      <Progress
        value={severityScore}
        max={10}
        colorScheme="red"
        size="sm"
        borderRadius="md"
        mt={2}
      />
      <Text fontSize="sm" color="gray.300">
        {severityScore} / 10
      </Text>

      {/* Stats */}
      <StatGroup mt={4}>
        <Stat>
          <StatLabel>Harmless</StatLabel>
          <StatNumber>{stats.harmless}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Malicious</StatLabel>
          <StatNumber>{stats.malicious}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Suspicious</StatLabel>
          <StatNumber>{stats.suspicious}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Undetected</StatLabel>
          <StatNumber>{stats.undetected}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Timeout</StatLabel>
          <StatNumber>{stats.timeout}</StatNumber>
        </Stat>
      </StatGroup>


    </Card>
    )
};


export default AnalysisCard;