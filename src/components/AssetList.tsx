import React, { memo } from 'react';
import { FlatList } from 'react-native';
import AssetItem from './AssetItem';

const AssetList = ({ assets, onAssetPress }) => {
  const renderItem = ({ item }) => (
    <AssetItem asset={item} onPress={() => onAssetPress(item.id)} />
  );

  return (
    <FlatList
      data={assets}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      initialNumToRender={10}
      maxToRenderPerBatch={20}
      windowSize={21}
    />
  );
};

export default memo(AssetList);

