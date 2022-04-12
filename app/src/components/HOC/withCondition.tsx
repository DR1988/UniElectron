import React from 'react'

interface WithConditionProps {
  condition: boolean
  render: () => JSX.Element
  resetToPreviousChanges: () => void
}

const withCondition = <P extends object>(
  WrapedComponent: React.ComponentType<P>
  ): React.FC<P & WithConditionProps> => ({
    condition,
    ...props
  }: WithConditionProps) =>
  !condition ? null: <WrapedComponent {...props as P} />;

export default withCondition
