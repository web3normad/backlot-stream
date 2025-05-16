// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Using interface instead of inheritance for ERC721Enumerable to save gas
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


library BacklotFlixUtils {
    using SafeMath for uint256;
    
    function calculateFee(uint256 amount, uint256 basisPoints) internal pure returns (uint256) {
        return amount.mul(basisPoints).div(10000);
    }
}

/**
 * @title BacklotFlix
 * @dev A blockchain-powered movie streaming and investment platform
 * Users can invest in film projects and receive NFTs representing their shares
 * When films generate revenue, investors receive payments based on their shares
 */
contract BacklotFlix is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    using BacklotFlixUtils for uint256;

    Counters.Counter private _tokenIds;
    Counters.Counter private _projectIds;

    // Platform fee percentage (in basis points, e.g. 250 = 2.5%)
    uint256 public platformFee = 250;
    
    // Investment tiers - using uint8 saves gas
    uint8 public constant BRONZE = 0;
    uint8 public constant SILVER = 1;
    uint8 public constant GOLD = 2;
    uint8 public constant PLATINUM = 3;

    // Project status - using uint8 saves gas
    uint8 public constant STATUS_FUNDING = 0;
    uint8 public constant STATUS_PRODUCTION = 1;
    uint8 public constant STATUS_STREAMING = 2;
    uint8 public constant STATUS_COMPLETED = 3;
    uint8 public constant STATUS_CANCELLED = 4;

    // Struct for film projects - optimized for storage
    struct FilmProject {
        uint256 id;
        address creator;
        string title;
        string description;
        string coverImageURI;
        uint256 fundingGoal;
        uint256 currentFunding;
        uint256 streamingRevenue;
        uint256 totalShares;
        uint256 remainingShares;
        uint8 status;
        uint256 createdAt;
        uint256[4] tierPricing;
        uint256[4] tierShares;
    }

    // Struct for NFT metadata
    struct InvestorNFT {
        uint256 projectId;
        address investor;
        uint8 tier;
        uint256 sharesOwned;
        uint256 amountInvested;
    }

    // Mapping from project ID to FilmProject
    mapping(uint256 => FilmProject) public projects;
    
    // Mapping from token ID to InvestorNFT
    mapping(uint256 => InvestorNFT) public investorNFTs;
    
    // Mapping for project token IDs
    mapping(uint256 => uint256[]) public projectTokens;
    
    // Mapping from project ID and investor address to shares
    mapping(uint256 => mapping(address => uint256)) public projectInvestorShares;
    
    // Events
    event ProjectCreated(uint256 indexed projectId, address indexed creator, string title, uint256 fundingGoal);
    event InvestmentMade(uint256 indexed projectId, address indexed investor, uint256 tokenId, uint8 tier, uint256 amount, uint256 shares);
    event ProjectStatusChanged(uint256 indexed projectId, uint8 newStatus);
    event RevenueDistributed(uint256 indexed projectId, uint256 amount);
    event RevenueAdded(uint256 indexed projectId, uint256 amount);
    event FundsWithdrawn(address indexed recipient, uint256 amount);
    
    constructor() ERC721("BacklotFlix Investor Shares", "BFLIX") Ownable(msg.sender) {
        // Initialize with contract deployer as owner
    }

    /**
     * @dev Create a new film project
     */
    function createProject(
        string calldata _title,
        string calldata _description,
        string calldata _coverImageURI,
        uint256 _fundingGoal,
        uint256 _totalShares,
        uint256[4] calldata _tierPricing,
        uint256[4] calldata _tierShares
    ) external {
        require(_fundingGoal > 0, "Invalid goal");
        require(_totalShares > 0, "Invalid shares");
        
        _projectIds.increment();
        uint256 newProjectId = _projectIds.current();
        
        FilmProject storage project = projects[newProjectId];
        project.id = newProjectId;
        project.creator = msg.sender;
        project.title = _title;
        project.description = _description;
        project.coverImageURI = _coverImageURI;
        project.fundingGoal = _fundingGoal;
        project.totalShares = _totalShares;
        project.remainingShares = _totalShares;
        project.status = STATUS_FUNDING;
        project.createdAt = block.timestamp;
        project.tierPricing = _tierPricing;
        project.tierShares = _tierShares;
        
        emit ProjectCreated(newProjectId, msg.sender, _title, _fundingGoal);
    }

    /**
     * @dev Invest in a film project
     */
    function investInProject(uint256 _projectId, uint8 _tier) external payable nonReentrant {
        FilmProject storage project = projects[_projectId];
        
        require(project.id != 0, "Project not found");
        require(project.status == STATUS_FUNDING, "Not funding");
        require(msg.value == project.tierPricing[_tier], "Wrong amount");
        require(project.tierShares[_tier] <= project.remainingShares, "No shares left");
        
        // Calculate shares for this investment
        uint256 sharesToMint = project.tierShares[_tier];
        
        // Update project funding and shares
        project.currentFunding = project.currentFunding.add(msg.value);
        project.remainingShares = project.remainingShares.sub(sharesToMint);
        projectInvestorShares[_projectId][msg.sender] = projectInvestorShares[_projectId][msg.sender].add(sharesToMint);
        
        // Mint NFT representing shares
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        
        // Store token data
        investorNFTs[newTokenId] = InvestorNFT({
            projectId: _projectId,
            investor: msg.sender,
            tier: _tier,
            sharesOwned: sharesToMint,
            amountInvested: msg.value
        });
        
        // Add token to project tokens
        projectTokens[_projectId].push(newTokenId);
        
        // Check if funding goal has been reached
        if (project.currentFunding >= project.fundingGoal) {
            project.status = STATUS_PRODUCTION;
            emit ProjectStatusChanged(_projectId, STATUS_PRODUCTION);
        }
        
        emit InvestmentMade(_projectId, msg.sender, newTokenId, _tier, msg.value, sharesToMint);
    }

    /**
     * @dev Add streaming revenue to a project
     */
    function addStreamingRevenue(uint256 _projectId) external payable nonReentrant {
        FilmProject storage project = projects[_projectId];
        
        require(project.id != 0, "Project not found");
        require(project.status == STATUS_STREAMING, "Not streaming");
        require(msg.value > 0, "Need revenue");
        
        project.streamingRevenue = project.streamingRevenue.add(msg.value);
        
        emit RevenueAdded(_projectId, msg.value);
    }

    /**
     * @dev Distribute streaming revenue to investors
     */
    function distributeRevenue(uint256 _projectId) external nonReentrant {
        FilmProject storage project = projects[_projectId];
        
        require(project.id != 0, "Project not found");
        require(project.status == STATUS_STREAMING, "Not streaming");
        require(project.streamingRevenue > 0, "No revenue");
        
        uint256 revenueToDistribute = project.streamingRevenue;
        project.streamingRevenue = 0;
        
        // Calculate platform fee
        uint256 platformFeeAmount = revenueToDistribute.calculateFee(platformFee);
        uint256 creatorFeeAmount = revenueToDistribute.calculateFee(1000); // 10% for creator
        uint256 investorAmount = revenueToDistribute.sub(platformFeeAmount).sub(creatorFeeAmount);
        
        // Transfer platform fee to contract owner
        payable(owner()).transfer(platformFeeAmount);
        
        // Transfer creator fee
        payable(project.creator).transfer(creatorFeeAmount);
        
        // Distribute to investors based on shares
        _distributeToInvestors(_projectId, investorAmount, project.totalShares);
        
        emit RevenueDistributed(_projectId, revenueToDistribute);
    }

    /**
     * @dev Internal function to distribute revenue to investors
     */
    function _distributeToInvestors(uint256 _projectId, uint256 _amount, uint256 _totalShares) internal {
        for (uint256 i = 0; i < projectTokens[_projectId].length; i++) {
            uint256 tokenId = projectTokens[_projectId][i];
            InvestorNFT memory investorNFT = investorNFTs[tokenId];
            address currentOwner = ownerOf(tokenId);
            
            // Calculate investor share
            uint256 investorShare = _amount.mul(investorNFT.sharesOwned).div(_totalShares);
            
            // Transfer to investor
            if (investorShare > 0) {
                payable(currentOwner).transfer(investorShare);
            }
        }
    }

    /**
 * @dev Get total number of projects created
 */
    function projectsCount() external view returns (uint256) {
    return _projectIds.current();
    }

    /**
     * @dev Update project status
     */
    function updateProjectStatus(uint256 _projectId, uint8 _newStatus) external {
        FilmProject storage project = projects[_projectId];
        
        require(project.id != 0, "Project not found");
        require(
            msg.sender == project.creator || msg.sender == owner(),
            "Not authorized"
        );
        
        // Validate status transitions
        if (_newStatus == STATUS_PRODUCTION) {
            require(
                project.status == STATUS_FUNDING && project.currentFunding >= project.fundingGoal,
                "Not fully funded"
            );
        } else if (_newStatus == STATUS_STREAMING) {
            require(
                project.status == STATUS_PRODUCTION,
                "Not in production"
            );
        } else if (_newStatus == STATUS_COMPLETED) {
            require(
                project.status == STATUS_STREAMING,
                "Not streaming"
            );
        } else if (_newStatus == STATUS_CANCELLED) {
            require(
                project.status == STATUS_FUNDING || project.status == STATUS_PRODUCTION,
                "Cannot cancel"
            );
        }
        
        project.status = _newStatus;
        emit ProjectStatusChanged(_projectId, _newStatus);
        
        // Handle cancellation refunds
        if (_newStatus == STATUS_CANCELLED && project.currentFunding > 0) {
            _refundInvestors(_projectId);
        }
    }

    /**
     * @dev Refund investors if project is cancelled
     */
    function _refundInvestors(uint256 _projectId) internal {
        for (uint256 i = 0; i < projectTokens[_projectId].length; i++) {
            uint256 tokenId = projectTokens[_projectId][i];
            InvestorNFT memory investorNFT = investorNFTs[tokenId];
            
            // Transfer investment amount back to investor
            payable(ownerOf(tokenId)).transfer(investorNFT.amountInvested);
        }
    }

    /**
     * @dev Creator can withdraw funds after project enters production
     */
    function withdrawFunds(uint256 _projectId) external nonReentrant {
        FilmProject storage project = projects[_projectId];
        
        require(project.id != 0, "Project not found");
        require(msg.sender == project.creator, "Not creator");
        require(
            project.status == STATUS_PRODUCTION || project.status == STATUS_STREAMING,
            "Not in production"
        );
        
        // Platform fee
        uint256 fee = project.currentFunding.calculateFee(platformFee);
        uint256 creatorAmount = project.currentFunding.sub(fee);
        
        // Reset current funding to prevent double withdrawal
        project.currentFunding = 0;
        
        // Transfer funds
        payable(owner()).transfer(fee);
        payable(project.creator).transfer(creatorAmount);
        
        emit FundsWithdrawn(project.creator, creatorAmount);
    }

    /**
     * @dev Update platform fee (owner only)
     */
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high");
        platformFee = _newFee;
    }

    /**
     * @dev Get project details
     */
    function getProjectDetails(uint256 _projectId) external view returns (
        uint256 id,
        address creator,
        string memory title,
        string memory description,
        string memory coverImageURI,
        uint256 fundingGoal,
        uint256 currentFunding,
        uint256 streamingRevenue,
        uint256 totalShares,
        uint256 remainingShares,
        uint8 status,
        uint256 createdAt
    ) {
        FilmProject storage project = projects[_projectId];
        return (
            project.id,
            project.creator,
            project.title,
            project.description,
            project.coverImageURI,
            project.fundingGoal,
            project.currentFunding,
            project.streamingRevenue,
            project.totalShares,
            project.remainingShares,
            project.status,
            project.createdAt
        );
    }

    /**
     * @dev Get project tier details
     */
    function getProjectTierInfo(uint256 _projectId) external view returns (
        uint256[4] memory tierPricing,
        uint256[4] memory tierShares
    ) {
        FilmProject storage project = projects[_projectId];
        return (project.tierPricing, project.tierShares);
    }

    /**
     * @dev Get investor shares in a project
     */
    function getInvestorShares(uint256 _projectId, address _investor) external view returns (uint256) {
        return projectInvestorShares[_projectId][_investor];
    }

    /**
     * @dev Get investor tokens for a project
     */
    function getInvestorTokensForProject(uint256 _projectId, address _investor) external view returns (uint256[] memory) {
        uint256[] memory allProjectTokens = projectTokens[_projectId];
        uint256 count = 0;
        
        // Count tokens owned by investor
        for (uint256 i = 0; i < allProjectTokens.length; i++) {
            if (ownerOf(allProjectTokens[i]) == _investor) {
                count++;
            }
        }
        
        // Create array of correct size
        uint256[] memory investorTokens = new uint256[](count);
        uint256 index = 0;
        
        // Fill array with tokens
        for (uint256 i = 0; i < allProjectTokens.length; i++) {
            if (ownerOf(allProjectTokens[i]) == _investor) {
                investorTokens[index] = allProjectTokens[i];
                index++;
            }
        }
        
        return investorTokens;
    }
    
    /**
     * @dev Returns URI for token metadata 
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token not found");
        // Simplified implementation to save gas
        return "";
    }

    // Required to receive ETH
    receive() external payable {}
}