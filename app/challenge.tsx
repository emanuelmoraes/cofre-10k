// app/challenge.tsx

import { Feather } from '@expo/vector-icons';
import { memo, useCallback, useMemo } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GOAL, SHUFFLED_VALUES } from '../constants/challenge';
import { UI_TEXT } from '../constants/strings';
import { useAppTheme } from '../contexts/ThemeContext';
import { createStyles } from './shared/materialStyles';
import { useIsMarked, useMarkedCells, useTotal } from './store/useMarkedCells';

type CellItemData = {
  value: number;
  index: number;
};

type ChallengeCellProps = {
  item: CellItemData;
  onToggle: (index: number) => void;
  checkColor: string;
  styles: ReturnType<typeof createStyles>;
};

const CELL_DATA: CellItemData[] = SHUFFLED_VALUES.map((value, index) => ({
  value,
  index,
}));

const ChallengeCell = memo(
  ({ item, onToggle, checkColor, styles }: ChallengeCellProps) => {
    const pressed = useIsMarked(item.index);

    return (
      <Pressable
        testID={`cell-${item.index}`}
        style={[styles.cell, pressed && styles.cellMarked]}
        onPress={() => onToggle(item.index)}
      >
        <Text style={[styles.cellText, pressed && styles.cellTextMarked]}>
          {item.value}
        </Text>
        {pressed && (
          <Feather
            name="check"
            size={12}
            color={checkColor}
            style={styles.checkIcon}
          />
        )}
      </Pressable>
    );
  }
);

ChallengeCell.displayName = 'ChallengeCell';

export default function Challenge() {
  const toggle = useMarkedCells((s) => s.toggle);
  const total = useTotal();
  
  const { isDark, toggleTheme, theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleToggleCell = useCallback(
    (index: number) => {
      toggle(index);
    },
    [toggle]
  );

  const renderItem = useCallback(
    ({ item }: { item: CellItemData }) => {
      return (
        <ChallengeCell
          item={item}
          onToggle={handleToggleCell}
          checkColor={theme.colors.primary}
          styles={styles}
        />
      );
    },
    [handleToggleCell, styles, theme.colors.primary]
  );

  const keyExtractor = useCallback((item: CellItemData) => item.index.toString(), []);

  const getItemLayout = useCallback(
    (_: ArrayLike<CellItemData> | null | undefined, index: number) => {
      const row = Math.floor(index / 6);
      const rowHeight = 66;
      return {
        length: rowHeight,
        offset: rowHeight * row,
        index,
      };
    },
    []
  );

  const isCompleted = total >= GOAL;
  const progress = (total / GOAL) * 100;

  return (
    <SafeAreaView style={styles.containerChallenge}>
      <IconButton
        icon={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'}
        size={24}
        onPress={toggleTheme}
        style={{
          alignSelf: 'flex-end',
          backgroundColor: theme.colors.surfaceVariant,
          marginBottom: 16,
        }}
        iconColor={theme.colors.onSurfaceVariant}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.titleChallenge}>{UI_TEXT.challenge.title}</Text>
          <Text style={[styles.label, { textAlign: 'center', marginBottom: 16 }]}>
            {UI_TEXT.challenge.subtitle}
          </Text>
        </View>

        <Card style={[styles.progressCard, isCompleted && styles.progressCardCompleted]}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text style={styles.labelChallenge}>{UI_TEXT.challenge.progressTitle}</Text>
            <Text style={styles.valueChallenge}>
              R$ {total.toLocaleString('pt-BR')} / R$ {GOAL.toLocaleString('pt-BR')}
            </Text>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(progress, 100)}%` },
                ]}
              />
            </View>

            {isCompleted && (
              <Text style={styles.successText}>{UI_TEXT.challenge.goalCompleted}</Text>
            )}
          </Card.Content>
        </Card>

        <Card style={[styles.surface, { padding: 12 }]}>
          <Card.Content>
            <FlatList
              data={CELL_DATA}
              numColumns={6}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.grid}
              scrollEnabled={false}
              initialNumToRender={120}
              maxToRenderPerBatch={120}
              windowSize={10}
              updateCellsBatchingPeriod={50}
              removeClippedSubviews={false}
              getItemLayout={getItemLayout}
              renderItem={renderItem}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
