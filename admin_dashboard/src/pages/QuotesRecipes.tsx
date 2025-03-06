import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Quotes from "../pages/Quotes";
import Recipes from '../pages/Recipes';

const QuotesRecipes: React.FC = () => {
  return (
    <Tabs variant="enclosed" isFitted>
      <TabList mb="1em">
        <Tab>Quotes</Tab>
        <Tab>Recipes</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Quotes />
        </TabPanel>
        <TabPanel>
          <Recipes />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default QuotesRecipes;
