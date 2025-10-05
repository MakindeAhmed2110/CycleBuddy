// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IX2EarnRewardsPool} from "./mocks/interfaces/IX2EarnRewardsPool.sol";

/**
 * @title CycleBuddyRewards
 * @notice Rewards CycleBuddy users for daily health tracking activities.
 * Each distinct activity logged once per day mints 1 B3TR to the user via
 * the X2Earn Rewards Pool, up to 4 activities/day.
 *
 * Activities:
 *  - Period Logging: start/end
 *  - Symptom Tracking: pain, mood, flow intensity
 *  - Mood Check-ins
 *  - Medication Reminders: birth control, pain relief
 */
contract CycleBuddyRewards is AccessControl, ReentrancyGuard {
  // ---------- Roles ---------- //
  bytes32 public constant CONFIG_ROLE = keccak256("CONFIG_ROLE");
  bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

  // ---------- Config ---------- //
  IX2EarnRewardsPool public rewardsPool;
  bytes32 public appId; // App id registered in rewards pool eco-system
  uint256 public rewardPerActivity; // in B3TR smallest units
  uint256 public maxDailyActivities; // safety cap

  // Activity bit flags
  uint8 private constant ACT_PERIOD_LOGGING = 1 << 0; // 0001
  uint8 private constant ACT_SYMPTOM_TRACK = 1 << 1;  // 0010
  uint8 private constant ACT_MOOD_CHECKIN = 1 << 2;   // 0100
  uint8 private constant ACT_MEDICATION = 1 << 3;     // 1000

  // user => dayIndex => bitmap of completed activities
  mapping(address => mapping(uint256 => uint8)) public userDayActivityBitmap;

  // ---------- Events ---------- //
  event ActivityRewarded(address indexed user, uint256 indexed dayIndex, uint8 activityFlag, uint256 amount);
  event ConfigUpdated(address rewardsPool, bytes32 appId, uint256 rewardPerActivity, uint256 maxDailyActivities);

  constructor(
    address admin,
    IX2EarnRewardsPool _rewardsPool,
    bytes32 _appId,
    uint256 _rewardPerActivity
  ) {
    require(admin != address(0), "admin is zero");
    require(address(_rewardsPool) != address(0), "rewardsPool is zero");
    require(_rewardPerActivity > 0, "reward is zero");

    _grantRole(DEFAULT_ADMIN_ROLE, admin);
    _grantRole(CONFIG_ROLE, admin);
    _grantRole(DISTRIBUTOR_ROLE, admin);

    rewardsPool = _rewardsPool;
    appId = _appId;
    rewardPerActivity = _rewardPerActivity;
    maxDailyActivities = 4;

    emit ConfigUpdated(address(rewardsPool), appId, rewardPerActivity, maxDailyActivities);
  }

  // ---------- Public helpers ---------- //
  function currentDayIndex() public view returns (uint256) {
    return block.timestamp / 1 days;
  }

  function hasCompleted(address user, uint256 dayIndex, uint8 flag) public view returns (bool) {
    return (userDayActivityBitmap[user][dayIndex] & flag) != 0;
  }

  function dailyCount(address user, uint256 dayIndex) public view returns (uint256) {
    uint8 b = userDayActivityBitmap[user][dayIndex];
    uint256 c;
    while (b != 0) {
      c += b & 1;
      b >>= 1;
    }
    return c;
  }

  // ---------- Internal core ---------- //
  function _rewardIfFirstToday(address user, uint8 flag) internal nonReentrant {
    uint256 dayIndex = currentDayIndex();
    uint8 bitmap = userDayActivityBitmap[user][dayIndex];

    // skip if already rewarded for this activity today
    if ((bitmap & flag) != 0) {
      return;
    }

    // enforce daily cap
    uint256 count = dailyCount(user, dayIndex);
    require(count < maxDailyActivities, "daily cap reached");

    // mark completed
    userDayActivityBitmap[user][dayIndex] = bitmap | flag;

    // distribute 1 B3TR via rewards pool to user
    rewardsPool.distributeReward(appId, rewardPerActivity, user, "");

    emit ActivityRewarded(user, dayIndex, flag, rewardPerActivity);
  }

  // ---------- User actions (callable by app/backend relayer) ---------- //
  // These functions can be called by a trusted relayer holding DISTRIBUTOR_ROLE, passing the user address

  function rewardPeriodLogging(address user) external onlyRole(DISTRIBUTOR_ROLE) {
    _rewardIfFirstToday(user, ACT_PERIOD_LOGGING);
  }

  function rewardSymptomTracking(address user) external onlyRole(DISTRIBUTOR_ROLE) {
    _rewardIfFirstToday(user, ACT_SYMPTOM_TRACK);
  }

  function rewardMoodCheckin(address user) external onlyRole(DISTRIBUTOR_ROLE) {
    _rewardIfFirstToday(user, ACT_MOOD_CHECKIN);
  }

  function rewardMedication(address user) external onlyRole(DISTRIBUTOR_ROLE) {
    _rewardIfFirstToday(user, ACT_MEDICATION);
  }

  // ---------- Admin ---------- //
  function setConfig(IX2EarnRewardsPool _rewardsPool, bytes32 _appId, uint256 _rewardPerActivity, uint256 _maxDailyActivities)
    external
    onlyRole(CONFIG_ROLE)
  {
    require(address(_rewardsPool) != address(0), "rewardsPool is zero");
    require(_rewardPerActivity > 0, "reward is zero");
    require(_maxDailyActivities > 0 && _maxDailyActivities <= 4, "maxDailyActivities out of range");

    rewardsPool = _rewardsPool;
    appId = _appId;
    rewardPerActivity = _rewardPerActivity;
    maxDailyActivities = _maxDailyActivities;

    emit ConfigUpdated(address(rewardsPool), appId, rewardPerActivity, maxDailyActivities);
  }
}


