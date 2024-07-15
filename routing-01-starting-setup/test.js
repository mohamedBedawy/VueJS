<template lang="pug">
.h-100.d-flex.flex-col
    v-tabs.a-tab.fixed.no-scroll
      v-tab(:title='icDetails.icNumber')
        span.loading-text(v-if="loading")
        .ellipsis(v-else) {{ icDetails.icNumber }}
    v-card.d-flex.flex-column.h-100
      <!-- Start -->
        div
          v-row(no-gutters='' align="center")
            v-col(
              v-for="item in summaryItems"
              :key="item.key"
              cols="12"
              sm="6"
              md="3"
              lg="3"
            )
              v-row.my-0
                v-col.py-0(
                  cols="6"
                  sm="6" :class="{'text-center': true}")
                  label.v-label.golden-label {{ item.label }}
            v-col(
              v-for="item in summaryItems"
              :key="`${item.key}-value`"
              cols="12"
              sm="6"
              md="3"
              lg="3"
            )
              v-row.my-0
                v-col.py-0( cols="6" sm="6" :class="{'text-center': true}" v-if="item.key !== 'status'")
                  | {{ item.value }}
                v-col.py-0( cols="6" sm="6" :class="{'text-center': true}" v-else)
                  v-chip.status(
                    :class="statusColor(item.value)",
                    label,
                    small,
                    ) {{ item.value.replace(/_/g, " ") }}

        <!-- end -->
      v-card.d-flex.flex-column.flex-1.h-100
        v-tabs.inside-tab.mt-6(
          v-model='tab',
          color='text',
          slider-color='primary',
          slider-size='3',
          style='flex: initial'
        )
          v-tab
            span.v-tabs__item__text {{ $t('intelligence.intelCase.labels.theRelatedIRs') }}
          v-tab
            span.v-tabs__item__text {{ $t('intelligence.intelCase.labels.attachments') }}
          v-tab(v-show="icDetails.collectionPlan")
            span.v-tabs__item__text {{ $t('intelligence.intelCase.labels.collectionPlan') }}
          v-tab(v-if="icDetails.collectionPlan")
            span.v-tabs__item__text {{ $t('intelligence.intelCase.labels.intelProduct') }}
        v-tabs-items.add-new-tab-items.flex-shrink-1.flex-grow-1.overflow-visible(v-model='tab')
          v-tab-item.h-100.pa-4
            <!-- start -->
            div.haft-box.mt-6
              label.v-label.golden-label
                | {{$t('intelligence.intelCase.labels.reportComments')}}
                v-tooltip(
                  :right="!$vuetify.rtl"
                  :left="$vuetify.rtl"
                  max-width="480")
                  template(#activator="{ on }")
                    v-icon(v-on="on" size="16").mx-1 mdi-information-outline
                  span {{ $t('intelligence.informationReport.tooltips.caseTitle') }}
              t-textarea(
                outlined
                rows="2"
                row-height="25"
                v-model="icDetails.comment"
                name="caseTitle"
                maxlength="500"
                readonly)
            <!-- end -->
            div.mt-6
              label.v-label.golden-label
                | {{$t('intelligence.intelCase.labels.theRelatedIRs')}}
              table
                tr(v-for="(item, index) in icDetails.infoReports" :key="index")
                  td
                    label.font-bold {{ $t('intelligence.informationReport.labels.irNumber') }} :
                    span.ml-2.mr-2 {{ item.irNumber }}
                  td
                    label.font-bold {{ $t('intelligence.informationReport.labels.priority') }} :
                    span.ml-2.mr-2 {{ getTranslatedValue(item.priority,'priority') }}
                  td
                    label.font-bold {{ $t('intelligence.informationReport.labels.threshRuleSetTrs') }} :
                    span.ml-2.mr-2 {{ getTranslatedValue(item.riskCategory,'riskCategory') }}
                  td(width='50px')
                    v-btn(icon @click="openIRDialog(item)")
                      v-icon(size="20") mdi-eye
            <!-- start -->
            div.haft-box.mt-6
              label.v-label
                | {{$t('intelligence.intelCase.labels.noteRemarks')}}
                span.error--text &nbsp;*
              t-textarea(
                outlined
                rows="3"
                row-height="25"
                v-model="remarks"
                name="questionnaireWhatYouKnow"
                maxlength="500"
                :readonly="notesReadonly()"
                required)
            <!-- end -->
          v-tab-item.mt-4.pa-4
            | {{ $t('common.placeholder.noData') }}.
          v-tab-item.mt-4.pa-4
            div.mt-6
              v-btn.d-block.mb-5(
                :ripple="false"
                color="primary"
                name="add-collection-step"
                :disabled="csAddButtonDisabled()"
                @click="handleCreateCSClick") {{ $t('intelligence.intelCase.buttons.addCollectionStep') }}
                v-icon.ml-2(size="24") mdi-plus
              span.todo-list-heading {{ $t('intelligence.intelCase.labels.collectionStepsHeading') }}
              div(v-for="item, count in collectionSteps" :key="item.csNumber")
                label.v-label.golden-label.mt-5.ml-3
                  | {{`${$t('intelligence.intelCase.labels.collectionStepHeading')} # ${count+1}` }}
                .todo
                  .flex-row
                    .width-50.flex-row-center
                      .todo-description-box.pa-2.min-height-120
                        p {{ item.description }}
                    .width-50.flex-row-center
                      .todo-meta-1.flex-column-center
                        .flex-row
                          span.border.pa-2.text-12.width-40
                            <strong>{{ $t('intelligence.intelCase.labels.createdBy') }} : </strong>{{ item.createdBy.displayName }}
                          span.border.pa-2.text-12.width-40
                            <strong>{{ $t('intelligence.intelCase.labels.createdAt') }} : </strong>{{ item.createdAt }}
                        .flex-row
                          span.border.pa-2.text-12.width-40
                            <strong>{{ $t('intelligence.intelCase.labels.updatedBy') }} : </strong>{{ `${item.updatedBy && item.updatedBy.displayName ? item.updatedBy.displayName : ""}` }}
                          span.border.pa-2.text-12.width-40
                            <strong>{{ $t('intelligence.intelCase.labels.updatedAt') }} : </strong>{{ item.updatedAt }}
                      .todo-meta-2.flex-column-center
                        v-btn.d-block(
                          :ripple="false"
                          color="primary"
                          name="edit-step"
                          style='width: 100px;color: #fff'
                          :disabled="csEditButtonDisabled(item)"
                          @click="() => handleEditCSClick(item)") {{$t('common.button.edit')}}
                        v-btn.d-block(
                          :ripple="false"
                          color="primary"
                          name="edit-step"
                          style='width: 100px;color: #fff'
                          :disabled="csDeleteButtonDisabled(item)"
                          @click="() => handleDeleteCSClick(item)") {{$t('common.button.delete')}}
                  div.flex-row.flex-gap(v-if="icDetails.status ==='DATA_COLLECTION_IN_PROGRESS'" )
                    .width-70
                      label
                        strong  {{ $t('intelligence.informationReport.labels.comment') }}
                        span(style="color: red;") *
                        | :
                      div.text-area-collectin.todo-description-box.pa-2.min-height-120 {{item.comment.description}}
                    .width-25.flex-row-left
                      .todo-meta-3.flex-column-center
                          span.border.pa-2.text-12.width-max-content(v-if="item.comment?.date")
                            <strong>{{ $t('intelligence.intelCase.labels.date') }} : </strong>{{ item.comment.date }}
                          v-btn.d-block(
                            :ripple="false"
                            color="primary"
                            name="edit-step"
                            @click="() => handleAddCommentClick(item)") {{$t('common.button.addComment')}}
                  .flex-row.flex-gap(v-if="icDetails.status ==='DATA_COLLECTION_IN_PROGRESS'" )
                    .width-70
                      label
                        strong {{ $t('intelligence.informationReport.labels.evaluation') }}
                        span(style="color: red;") *
                        | :
                      div.text-area-collectin.todo-description-box.pa-2.min-height-120 {{item.evaluation.description}}
                    .width-25.flex-row-left
                      .todo-meta-3.flex-column-center
                        span.border.pa-2.text-12.width-max-content(v-if="item.evaluation?.date")
                          <strong>{{ $t('intelligence.intelCase.labels.date') }} : </strong>{{ item.evaluation.date }}
                        v-btn.d-block(
                          :ripple="false"
                          color="primary"
                          name="edit-step"
                          @click="() => handleAddEvaluationClick(item)") {{ $t('common.button.addEvaluation')}}

          <!-- this for Product Intel -->
          v-tab-item.mt-4.pa-4
            div.drop-area(
              v-if="isDragOver"
              :class="{ 'drag-over': isDragOver }"
              @dragover="handleDragOver" @drop="handleDrop" @dragleave="handleDragLeave"
              )
                p Drop files here
            v-btn.d-block.mb-5(
              v-if="!isDragOver"
              :ripple="false"
              rounded
              depressed
              color="primary"
              name="upload-intel-product"
              @dragover="handleDragOver" @drop="handleDrop" @dragleave="handleDragLeave"
              @click="$refs.fileInputUploadIntelProduct.$refs.input.click()")

              v-icon.ml-2.mr-2(size="24") mdi-cloud-upload
              | {{ $t('intelligence.intelCase.buttons.uploadIntelProduct') }}
            v-file-input(
              v-show="false"
              ref="fileInputUploadIntelProduct"
              :rules="fileRules"
              v-model="file"
              :multiple="true"
              accept=".xlsx,.xls,.csv,.doc,.docx,.pdf,.png,.jpg,.jpeg"
              @change="onFileChange")
            div.mt-2( v-if="uploadedFiles.length > 0")
              label.v-label.golden-label
                | Files
              table
                tr
                  th.text-align-justify
                    label.font-bold.ml-2.mr-2  File name
                  th.text-align-justify
                    label.font-bold.ml-2.mr-2  Size
                  th.text-align-justify
                    label.font-bold.ml-2.mr-2  Type
                  th.text-align-center
                    label.font-bold.ml-2.mr-2 Action
                tr(v-for="(item, index) in uploadedFiles" :key="index")
                  td
                    span.ml-2.mr-2.text-decoration-underline.hover-click(@click="DownloadAttachment(item.pdNumber)") {{ item.fileName }}
                  td
                    span.ml-2.mr-2 {{ item.fileSize }} &nbsp MB
                  td
                    span.ml-2.mr-2 {{ item.fileType }}
                  td.text-center
                    v-btn(
                      :ripple="false"
                      color="primary"
                      name="delete-attachment"
                      style='width: 100px;color: #fff'
                      @click="() => handleDeleteIntelFileClick(item)") {{$t('common.button.delete')}}

          <!-- this for end Intel product -->


    IRPerformAction(v-if="canPerformAction" :actionType="actionType" @createCollectionPlan="createCollectionPlan" :actions="actions" :loading="actionLoading" @acknowledgeIC="acknowledgeIC" @acceptIC="acceptIC" @rejectIC="rejectIC" :disabled="isPerformActionActive" @sendToSupervisor="sendToSupervisor" @approve="approve" :showSave="true" @save="saveIC" @startDataCollection="startDataCollection" @attachIntelProduct="attachIntelProduct")
    v-dialog(v-model="isCreateCollectionStepDialogOpen", width="500", title="Add Collection Step" persistent)
      CollectionStepForm(v-if="isCreateCollectionStepDialogOpen" @close="isCreateCollectionStepDialogOpen = false" @submit="createCollectionStep" :loading="createCSLoading")
    v-dialog(v-model="isEditCollectionStepDialogOpen", width="500", title="Edit Collection Step" persistent)
      CollectionStepForm(v-if="isEditCollectionStepDialogOpen" @close="isEditCollectionStepDialogOpen = false" @submit="saveCollectionStep" :loading="createCSLoading" :editing="editingCS")
    v-dialog(v-model="isDeleteCollectionStepDialogOpen", width="500", title="Delete Collection Step" persistent)
      v-card.px-0#intelCard(:loading='loading' height="260px")
        v-card-title
        v-card-text
          h2.mb-10(style="font-weight: 500;line-height: 1.2;") {{ $t('intelligence.intelCase.messages.deleteCollectionStep') }}
          div.d-flex.gap-4
            v-btn.mr-2(color="primary" @click="deleteCollectionStep") {{$t('common.text.yes')}}
            v-btn(color="text" @click="handleDeleteCSClick") {{$t('common.button.cancel')}}
    v-dialog(v-model="isIRDialogOpen" color="primary")
      div.d-flex.h-100
        v-card.w-100.pt-4
          IRDetails(:data="selectedIR" :evaluation="selectedEvaluation" :closeDialog="closeDialog")
    <!-- Start Data collection In Progress -->
    v-dialog(v-model="isAddCommentDialogOpen", width="500", title="Add Comment" persistent)
      CollectionStepForm(v-if="isAddCommentDialogOpen" @close="isAddCommentDialogOpen = false" @submitCommentEvaluation="AddCommentCollectionStep" :loading="createCSLoading" :collectionInProgress="true" :collectionInProgressType="1" :collectionStep="SelectedCollectionStep")
    v-dialog(v-model="isAddEvaluationDialogOpen", width="500", title="Add Comment" persistent)
      CollectionStepForm(v-if="isAddEvaluationDialogOpen" @close="isAddEvaluationDialogOpen = false" @submitCommentEvaluation="AddEvaluationtCollectionStep" :loading="createCSLoading" :collectionInProgress="true" :collectionInProgressType="2" :collectionStep="SelectedCollectionStep")
    v-dialog(v-model="isDeleteIntelFileAttachment", width="500", title="Delete Attachment" persistent)
      v-card.px-0#intelCard(:loading='loading' height="260px")
        v-card-title
        v-card-text
          h2.mb-10(style="font-weight: 500;line-height: 1.2;") {{ $t('intelligence.intelCase.messages.deleteAttachment') }}
          div.d-flex.gap-4
            v-btn.mr-2(color="primary" @click="DeleteAttachment") {{$t('common.text.yes')}}
            v-btn(color="text" @click="handleDeleteIntelFileClick") {{$t('common.button.cancel')}}
</template>
<script>
import TTextarea from '@/components/shared/base/TTextarea.vue'
import icScv from '@/core/services/intel-case.service'
import cpScv from '@/core/services/collection-plan.service'
import csScv from '@/core/services/collection-step.service'
import ipScv from '@/core/services/intel-product.service'

import { statusColor } from '@/core/utils/color.util'
import toast from '@/core/utils/message.util'
import EnumsMixin from '@/core/mixins/enums.mixin'
import IRDetails from './components/IRDetails.vue'
import IRPerformAction from './components/IRPerformAction.vue'
import { ICStatuses, ICTypes } from './constants'
import CollectionStepForm from './components/CollectionStepForm.vue'

export default {
  name: 'IntelligenceCaseDetails',
  components: {
    TTextarea,
    IRPerformAction,
    IRDetails,
    CollectionStepForm,
  },
  mixins: [EnumsMixin],
  data() {
    const intelProductDocuemnt = {
      pdNumber: String,
      fileName: String,
      fileType: String,
      fileSize: String,
    }
    return {
      tab: this.$roles.includes('INTEL_SUPERVISOR') ? 2 : 0,
      loading: false,
      actionLoading: false,
      remarks: '',
      icDetails: {},
      selectedIR: {},
      selectedEvaluation: {},
      isIRDialogOpen: false,
      infoReports: [],
      isCreateCollectionStepDialogOpen: false,
      isEditCollectionStepDialogOpen: false,
      isDeleteCollectionStepDialogOpen: false,
      createCSLoading: false,
      // collectionSteps: [],
      editingCS: null,
      deletingCS: null,
      // for start data collection in plan
      isAddCommentDialogOpen: false,
      isAddEvaluationDialogOpen: false,
      SelectedCollectionStep: null,
      // for upload file
      uploadedFiles: Array.of(intelProductDocuemnt),
      file: null,
      fileRules: [
        (value) => (value && value?.size < 10485760 ? true : `${value?.name} : File size should be less than 10 MB`),
        (value) => (value && value?.name?.length < 50 ? true : `${value?.name} : File name should be less than 50 characters`),

        (value) =>
          value && ['xlsx', 'xls', 'csv', 'doc', 'docx', 'pdf', 'png', 'jpg', 'jpeg'].includes(value?.name?.split('.')?.pop()?.toLowerCase())
            ? true
            : `${value?.name} : The allowed files types are Excel, CSV, Word, PDF, PNG, JPG & JPEG`,
      ],
      isDragOver: false,
      isDeleteIntelFileAttachment: false,
      deletingFileAttachment: null,
    }
  },
  computed: {
    canPerformAction() {
      return [ICStatuses.ACKNOWLEDGED, ICStatuses.SUBMITTED, ICStatuses.ACCEPTED].includes(this.icDetails.status) || this.icDetails.collectionPlan
    },
    isPerformActionActive() {
      if (this.icDetails.collectionPlan) return false
      if (!this.remarks) return true
    },
    actionType() {
      if ([ICStatuses.ACCEPTED].includes(this.icDetails.status)) return 'button'
      return 'menu'
    },
    actions() {
      let actionToReturn = []
      if (this.icDetails.collectionPlan) {
        if (this.icDetails.status !== 'DATA_COLLECTION_IN_PROGRESS' && !this.$roles.includes('INTEL_SUPERVISOR')) {
          actionToReturn.push({
            name: this.$t('intelligence.intelCase.buttons.sendToSupervisor'),
            action: 'sendToSupervisor',
            show: true,
            icon: 'mdi-account-arrow-right',
          })
        }
        if (this.icDetails.status === 'PLAN_APPROVED') {
          return [
            {
              name: this.$t('intelligence.intelCase.buttons.startDataCollection'),
              action: 'startDataCollection',
              show: true,
              icon: 'mdi-account-arrow-right',
            },
          ]
        }
        if (this.icDetails.status === 'DATA_COLLECTION_IN_PROGRESS') {
          actionToReturn.push({
            name: this.$t('intelligence.intelCase.buttons.attachIntelProduct'),
            action: 'attachIntelProduct',
            show: true,
            icon: 'mdi-file-document',
          })
        }
        if (this.$roles.includes('INTEL_SUPERVISOR')) {
          actionToReturn.push({
            name: this.$t('intelligence.intelCase.buttons.approve'),
            action: 'approve',
            show: true,
            icon: 'mdi-account-arrow-right',
          })
        }
        actionToReturn.push({
          name: this.$t('intelligence.intelCase.buttons.onHold'),
          show: true,
          icon: 'mdi-file-document',
        })
      } else {
        actionToReturn = [
          {
            name: this.$t('intelligence.intelCase.buttons.accept'),
            action: 'acceptIC',
            show: this.icDetails.status === ICStatuses.ACKNOWLEDGED,
            icon: 'mdi-text-box-plus',
          },
          {
            name: this.$t('intelligence.intelCase.buttons.reject'),
            action: 'rejectIC',
            show: this.icDetails.status === ICStatuses.ACKNOWLEDGED,
            icon: 'mdi-lock-open',
          },
          {
            name: this.$t('intelligence.intelCase.buttons.acknowledgedCases'),
            action: 'acknowledgeIC',
            show: this.icDetails.status === ICStatuses.SUBMITTED,
            icon: 'mdi-account-arrow-right',
          },
        ]
      }
      return actionToReturn
    },
    summaryItems() {
      return [
        {
          key: 'icNumber',
          label: this.$t('intelligence.intelCase.labels.icNumber'),
          value: this.icDetails.icNumber,
        },
        {
          key: 'createdDate',
          label: this.$t('intelligence.intelCase.labels.createdDate'),
          value: this.icDetails.createdDate,
        },
        {
          key: 'createdBy',
          label: this.$t('intelligence.intelCase.labels.createdBy'),
          value:
            this.icDetails.collectionPlan &&
            ['PLAN_IN_PROGRESS', 'PLAN_UNDER_REVIEW', 'PLAN_APPROVED', 'DATA_COLLECTION_IN_PROGRESS'].includes(this.icDetails.status)
              ? this.icDetails?.collectionPlan?.createdBy?.displayName
              : this.icDetails.createdBy
                ? this.icDetails.createdBy.displayName
                : '',
        },
        {
          key: 'status',
          label: this.$t('intelligence.intelCase.labels.status'),
          value: this.getTranslatedValue(this.icDetails.status, 'status'),
        },
      ]
    },
  },
  created() {
    this.getICDetails()
    // if (this.icDetails.status === 'DATA_COLLECTION_IN_PROGRESS') {
    //   this.getProductAttachments()
    // }
    this.uploadedFiles = []
  },
  methods: {
    notesReadonly() {
      if (
        ![
          'SUBMITTED',
          'EVALUATED',
          'ACCEPTED',
          'ACKNOWLEDGED',
          'PLAN_IN_PROGRESS',
          'PLAN_APPROVED',
          'DATA_COLLECTION_IN_PROGRESS',
          'PRODUCT_IN_PROGRESS',
        ].includes(this.icDetails.status)
      ) {
        return true
      }
      return false
    },
    csEditButtonDisabled(step) {
      if (this.icDetails.status === 'PLAN_UNDER_REVIEW' && !this.$roles.includes('INTEL_SUPERVISOR')) return true
      if (this.$roles.includes('INTEL_SUPERVISOR') && step.approvedOnce) return true
      if (this.icDetails.status === 'DATA_COLLECTION_IN_PROGRESS' && !this.$roles.includes('INTEL_SUPERVISOR')) return true
      return false
    },
    csDeleteButtonDisabled(step) {
      if (this.icDetails.status === 'PLAN_UNDER_REVIEW' && !this.$roles.includes('INTEL_SUPERVISOR')) return true
      if (this.$roles.includes('INTEL_SUPERVISOR') && step.approvedOnce) return true
      if (this.icDetails.status === 'DATA_COLLECTION_IN_PROGRESS' && !this.$roles.includes('INTEL_SUPERVISOR')) return true
      if (this.icDetails.status === 'DATA_COLLECTION_IN_PROGRESS' && !this.$roles.includes('INTEL_SUPERVISOR')) return true

      return false
    },
    csAddButtonDisabled() {
      if (this.icDetails.status === 'PLAN_UNDER_REVIEW' && !this.$roles.includes('INTEL_SUPERVISOR')) return true
      if (this.$roles.includes('INTEL_SUPERVISOR') && this.icDetails.status === 'PLAN_APPROVED') return true
      if (this.icDetails.status === 'DATA_COLLECTION_IN_PROGRESS' && !this.$roles.includes('INTEL_SUPERVISOR')) return true
      return false
    },
    statusColor,
    openIRDialog(ir) {
      this.selectedIR = ir
      this.selectedEvaluation = this.icDetails.evalReports ? this.icDetails.evalReports.find((e) => e.irNumber === ir.irNumber) : {}
      this.isIRDialogOpen = true
    },
    closeDialog() {
      this.isIRDialogOpen = false
    },
    handleCreateCSClick() {
      this.isCreateCollectionStepDialogOpen = true
    },
    handleEditCSClick(cs) {
      this.isEditCollectionStepDialogOpen = true
      this.editingCS = cs
    },
    handleDeleteCSClick(cs) {
      this.isDeleteCollectionStepDialogOpen = !this.isDeleteCollectionStepDialogOpen
      this.deletingCS = cs
    },
    handleAddCommentClick(cs) {
      this.isAddCommentDialogOpen = true
      this.SelectedCollectionStep = cs
    },
    handleAddEvaluationClick(cs) {
      this.isAddEvaluationDialogOpen = true
      this.SelectedCollectionStep = cs
    },
    createCollectionStep(data) {
      this.createCSLoading = true
      const { description } = data
      csScv
        .createCollectionStep(this.icDetails.collectionPlan?.cpNumber, description)
        .then((res) => {
          this.createCSLoading = false
          toast.success(this.$t('intelligence.intelCase.messages.createCollectionStepSuccess'))
          this.getCollectionSteps()
        })
        .catch((e) => {
          toast.error(this.$t('intelligence.intelCase.messages.createCollectionStepError'))
        })
        .finally(() => {
          this.createCSLoading = false
          this.isCreateCollectionStepDialogOpen = false
        })
    },
    saveCollectionStep(formdata, cs) {
      this.editCSLoading = true
      const { description } = formdata
      csScv
        .saveCollectionStep(cs.csNumber, description)
        .then((res) => {
          this.editCSLoading = false
          toast.success(this.$t('intelligence.intelCase.messages.updateCollectionStepSuccess'))
          this.getCollectionSteps()
        })
        .catch((e) => {
          toast.error(this.$t('intelligence.intelCase.messages.updateCollectionStepError'))
        })
        .finally(() => {
          this.editCSLoading = false
          this.isEditCollectionStepDialogOpen = false
          this.editingCS = null
        })
    },
    deleteCollectionStep() {
      this.deleteCSLoading = true
      csScv
        .deleteCollectionStep(this.deletingCS.csNumber)
        .then((res) => {
          this.deleteCSLoading = false
          toast.success(this.$t('intelligence.intelCase.messages.deleteCollectionStepSuccess'))
          this.getCollectionSteps()
        })
        .catch((e) => {
          toast.error(this.$t('intelligence.intelCase.messages.deleteCollectionStepError'))
        })
        .finally(() => {
          this.deleteCSLoading = false
          this.isDeleteCollectionStepDialogOpen = false
          this.deletingCS = null
        })
    },
    async getICDetails() {
      const icNumber = this.$route.params.id
      this.loading = true
      const resp = await icScv.getICDetails(icNumber).finally(() => {
        this.loading = false
      })
      this.icDetails = resp
      this.remarks = this.icDetails.remarks
      this.getCollectionSteps()
    },
    async getCollectionSteps() {
      if (this.icDetails.collectionPlan?.cpNumber) {
        const resp = await csScv.getCollectionSteps(this.icDetails.collectionPlan?.cpNumber)
        this.collectionSteps = resp
      }
    },
    async createCollectionPlan() {
      this.actionLoading = true
      const resp = await cpScv
        .createCollectionPlan(this.icDetails.icNumber)
        .catch(() => {
          toast.error(this.$t('intelligence.intelCase.messages.createCollectionPlanError'))
        })
        .finally(() => {
          this.actionLoading = false
        })
      if (resp) {
        toast.success(this.$t('intelligence.intelCase.messages.createCollectionPlanSuccess'))
        this.getICDetails()
        this.tab = 2
      }
    },
    async acknowledgeIC() {
      this.actionLoading = true
      const resp = await icScv
        .acknowledgeIC(this.icDetails.icNumber, this.remarks)
        .catch(() => {
          toast.error(this.$t('intelligence.intelCase.messages.acknowledgedError'))
        })
        .finally(() => {
          this.actionLoading = false
        })
      if (resp) {
        toast.success(this.$t('intelligence.intelCase.messages.acknowledgedSuccess'))
        this.$router.push({ name: 'Intelligence Cases', query: { type: ICTypes.myCase.key } })
      }
    },
    async acceptIC() {
      this.actionLoading = true
      const resp = await icScv
        .acceptIC(this.icDetails.icNumber)
        .catch(() => {
          toast.error(this.$t('intelligence.intelCase.messages.acceptedError'))
        })
        .finally(() => {
          this.actionLoading = false
        })
      if (resp) {
        toast.success(this.$t('intelligence.intelCase.messages.acceptedSuccess'))
        this.$router.push({
          name: 'Intelligence Cases',
          query: { type: ICTypes.acceptedCase.key },
        })
      }
    },
    async rejectIC() {
      this.actionLoading = true
      const resp = await icScv
        .rejectIC(this.icDetails.icNumber)
        .catch(() => {
          toast.error(this.$t('intelligence.intelCase.messages.rejectedError'))
        })
        .finally(() => {
          this.actionLoading = false
        })
      if (resp) {
        toast.success(this.$t('intelligence.intelCase.messages.rejectedSuccess'))
        this.$router.push({
          name: 'Intelligence Cases',
          query: { type: ICTypes.acknowledgedCase.key },
        })
      }
    },
    async sendToSupervisor() {
      if (this.icDetails.status === 'PLAN_UNDER_REVIEW') {
        toast.error(this.$t('intelligence.intelCase.messages.sendToSupervisorValidation2'))
      } else if (this.collectionSteps?.length > 0) {
        this.actionLoading = true
        const resp = await cpScv
          .sendToSupervisor(this.icDetails.collectionPlan.cpNumber)
          .then(() => {
            toast.success(this.$t('intelligence.intelCase.messages.sendToSupervisorSuccess'))
            this.$router.push({
              name: 'Intelligence Cases',
              query: { type: ICTypes.underApprovalCase.key },
            })
          })
          .catch(() => {
            toast.error(this.$t('intelligence.intelCase.messages.sendToSupervisorError'))
          })
          .finally(() => {
            this.actionLoading = false
          })
      } else {
        toast.error(this.$t('intelligence.intelCase.messages.sendToSupervisorValidation'))
      }
    },
    async approve() {
      if (this.collectionSteps?.length > 0) {
        this.actionLoading = true
        const resp = await cpScv
          .approve(this.icDetails.collectionPlan.cpNumber)
          .then(() => {
            toast.success(this.$t('intelligence.intelCase.messages.approveSuccess'))
            this.$router.push({
              name: 'Intelligence Cases',
              query: { type: ICTypes.underApprovalCase.key },
            })
          })
          .catch(() => {
            toast.error(this.$t('intelligence.intelCase.messages.approveError'))
          })
          .finally(() => {
            this.actionLoading = false
          })
      } else {
        toast.error(this.$t('intelligence.intelCase.messages.sendToSupervisorValidation'))
      }
    },
    async saveIC() {
      if ((this.icDetails.collectionPlan && this.collectionSteps?.length > 0) || !this.icDetails.collectionPlan || this.tab !== 2) {
        this.actionLoading = true
        const resp = await icScv
          .saveIC(this.icDetails.icNumber, {
            remarks: this.remarks,
            title: this.icDetails.title,
            comment: this.icDetails.comment,
            irNumbers: this.icDetails?.infoReports.map((i) => i.irNumber),
          })
          .catch(() => {
            toast.error(this.$t('intelligence.intelCase.messages.saveError'))
          })
          .finally(() => {
            this.actionLoading = false
          })
        if (resp) {
          toast.success(this.$t('intelligence.intelCase.messages.saveSuccess'))
        }
      } else {
        toast.error(this.$t('intelligence.intelCase.messages.sendToSupervisorValidation'))
      }
    },
    getTranslatedValue(value, key) {
      return this.enums[key].find((item) => item.name === value)?.label || '-'
    },

    // Region Start: Product Attachment Code
    // Attach intel product
    async attachIntelProduct() {
      console.log('attachIntelProduct', 'to Do')
      // to Do Attach intel Product
      if (this.icDetails.status !== 'Data_COLLECTION_IN_PROGRESS') {
        toast.error(this.$t('intelligence.intelCase.messages.theProductIsNotInProgress'))
      } else if (this.collectionSteps?.length > 0) {
        this.actionLoading = true
        await icScv
          .attachIntelProduct(this.icDetails.IcNumber)
          .then(() => {
            toast.success(this.$t('intelligence.intelCase.messages.theProductIsInProgressSuccessfully'))
          })
          .catch((e) => {
            toast.error(this.$t('intelligence.intelCase.messages.theProductIsInProgressError'))
          })
          .finally(() => {
            this.actionLoading = false
          })
      } else {
        toast.error(this.$t('intelligence.intelCase.messages.startDataCollectionError'))
      }
    },
    async getProductAttachments() {
      // get product attachments
      const resp = await ipScv.getProductAttachments(this.icDetails.icNumber)
      this.uploadedFiles = resp
    },
    // upload intel product attachment
    async uploadIntelProductAttachment(selectedFiles) {
      // prepare form data
      const formData = new FormData()
      formData.append('documentFile', this.file)
      await ipScv
        .uploadProductAttachment(this.file)
        .then(() => {
          toast.success(this.$t('intelligence.intelCase.messages.uploadAttachmentSuccess'))
        })
        .catch(() => {
          toast.error(this.$t('intelligence.intelCase.messages.uploadAttachmentError'))
        })
      // to do
      // add JS code to uploadedFiles
    },
    handleDeleteIntelFileClick(item) {
      this.isDeleteIntelFileAttachment = !this.isDeleteIntelFileAttachment
      this.deletingFileAttachment = item
    },
    async DeleteAttachment() {
      this.uploadedFiles = this.uploadedFiles.filter((item) => item.pdNumber !== this.deletingFileAttachment.pdNumber)
      this.isDeleteIntelFileAttachment = !this.isDeleteIntelFileAttachment
      toast.success(this.$t('intelligence.intelCase.messages.deleteAttachmentSuccess'))

      // to do call from service
      // await ipScv
      //   .deleteProductAttachment(id)
      //   .then(() => {
      //     toast.success(this.$t('intelligence.intelCase.messages.deleteAttachmentSuccess'))
      //   })
      //   .catch(() => {
      //     toast.error(this.$t('intelligence.intelCase.messages.deleteAttachmentError'))
      //   })
      // this.uploadedFiles = this.uploadedFiles.filter((item) => item.productDocumentNumber() !== id)
    },
    async DownloadAttachment(id) {
      // to do call from service
      const imageUrl = 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
      const fileName = 'downloaded_image.jpg'

      try {
        await fetch(imageUrl)
          .then((response) => response.blob())
          .then((blob) => {
            // Create a temporary anchor element
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = fileName

            // Trigger a click event to start the download
            link.click()

            // Clean up resources
            setTimeout(() => {
              URL.revokeObjectURL(link.href)
              link.remove()
            }, 100)
          })
        toast.success(this.$t('intelligence.intelCase.messages.downloadAttachmentSuccess'))
      } catch (e) {
        toast.error(this.$t('intelligence.intelCase.messages.downloadAttachmentError'))
      }
      // await ipScv
      //   .downloadProductAttachment(id)
      //   .then((response) => {
      //     debugger
      //     const fileUrl = window.URL.createObjectURL(new Blob([response]))
      //     window.open(fileUrl)
      //     toast.success(this.$t('intelligence.intelCase.messages.downloadAttachmentSuccess'))
      //   })
      //   .catch((e) => {
      //     debugger
      //     cosole.log(e)
      //     toast.error(this.$t('intelligence.intelCase.messages.downloadAttachmentError'))
      //   })
    },
    onFileChange() {
      const validationResult = this.validateFiles(this.file)
      if (validationResult.valid) {
        // this.uploadIntelProductAttachment(validationResult.selectedFiles)
        this.file = null
        toast.success(validationResult.message)
      } else {
        this.file = null
        toast.error(validationResult.message)
      }
    },
    validateFiles(files) {
      const selectedFiles = []
      if (!files) {
        return { valid: false, message: 'No file selected' }
      }
      if (files.length + this.uploadedFiles.length > 5) {
        return { valid: false, message: 'Maximum 5 files can be uploaded' }
      }
      for (const file of Array.from(files)) {
        for (const rule of this.fileRules) {
          const rule_file = rule(file)
          if (rule_file !== true) {
            return { valid: false, message: rule_file || 'File validation failed' }
          }
        }
        // return type of file
        const result = { fileName: file.name, fileSize: file.size, fileType: file.type }
        selectedFiles.push(result)
        this.uploadedFiles.push(result)
      }
      return { valid: true, message: 'File uploaded successfully', selectedFiles }
    },

    handleDragOver(event) {
      event.preventDefault()
      this.isDragOver = true
    },
    handleDragLeave() {
      this.isDragOver = false
    },
    handleDrop(event) {
      event.preventDefault()
      this.isDragOver = false
      this.file = event.dataTransfer.files
      // Process the dropped files
      this.onFileChange()
    },
    // Region End: Product Attachment Code

    // Region Start : Data collection In progress
    async startDataCollection() {
      if (this.icDetails.status !== 'PLAN_APPROVED') {
        toast.error(this.$t('intelligence.intelCase.messages.thePlanIsNotApproved'))
      } else if (this.collectionSteps?.length > 0) {
        this.actionLoading = true
        const resp = await csScv
          .startDataCollection(this.icDetails.collectionPlan.cpNumber)
          .then(() => {
            toast.success(this.$t('intelligence.intelCase.messages.startDataCollectionSuccess'))
            this.getICDetails()
          })
          .catch((e) => {
            toast.error(this.$t('intelligence.intelCase.messages.startDataCollectionError'))
          })
          .finally(() => {
            this.actionLoading = false
          })
      } else {
        toast.error(this.$t('intelligence.intelCase.messages.startDataCollectionError'))
      }
    },
    async AddCommentCollectionStep(formdata, selectedCS) {
      this.createCSLoading = true
      const data = { id: selectedCS.comment.csCommentNumber, description: formdata.description }
      await csScv
        .AddCommentCollectionStep(data)
        .then((res) => {
           this.getCollectionSteps()
          this.createCSLoading = false
          toast.success(this.$t('intelligence.intelCase.messages.CommentAddedSuccessfully'))
        })
        .catch((e) => {
          toast.error(this.$t('intelligence.intelCase.messages.CommentAddedSuccessfullyError'))
        })
        .finally(() => {
          this.createCSLoading = false
          this.isAddCommentDialogOpen = false
          this.SelectedCollectionStep = null
        })
    },
    async AddEvaluationtCollectionStep(formdata, selectedCS) {
      this.createCSLoading = true
      const data = { id: selectedCS.evaluation.csEvaluationNumber, description: formdata.description }
      await csScv
        .AddEvaluationCollectionStep(data)
        .then((res) => {
          this.getCollectionSteps()
          this.createCSLoading = false
          toast.success(this.$t('intelligence.intelCase.messages.EvaluationAddedSuccessfully'))
        })
        .catch((e) => {
          toast.error(this.$t('intelligence.intelCase.messages.EvaluationAddedSuccessfullyError'))
        })
        .finally(() => {
          this.createCSLoading = false
          this.isAddEvaluationDialogOpen = false
          this.SelectedCollectionStep = null
        })
    },

    // Region End: Data collection In progress
  },
}
</script>
<style lang="scss" scoped>
.flex-1 {
  flex: 1;
}
.bg-red {
  background-color: red;
}
::v-deep .b-input .v-input .v-input__slot,
::v-deep .b-select .v-input .v-input__slot,
::v-deep .b-textarea .v-input .v-input__slot {
  border-bottom: none !important;
}
::v-deep .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot,
::v-deep .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot,
::v-deep .v-text-field.v-text-field--enclosed .v-text-field__details {
  padding: 0 12px !important;
}
.haft-box {
  width: 650px;
  max-width: 100%;
}

table {
  width: 100%;
  border-spacing: 0 20px;
  margin-top: -20px;
  tr {
    border: 1px solid rgba(var(--rl-sub-text-color-rgb), 0.74);
    td {
      padding: 10px;
      border-bottom: 1px solid rgba(var(--rl-sub-text-color-rgb), 0.74);
      border-top: 1px solid rgba(var(--rl-sub-text-color-rgb), 0.74);
      &:first-child {
        border-left: 1px solid rgba(var(--rl-sub-text-color-rgb), 0.74);
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      &:last-child {
        border-right: 1px solid rgba(var(--rl-sub-text-color-rgb), 0.74);
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
  }
}
.v-application--is-rtl {
  table {
    tr {
      td {
        &:first-child {
          border-right: 1px solid rgba(var(--rl-sub-text-color-rgb), 0.74);
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
          border-left: none;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        &:last-child {
          border-left: 1px solid rgba(var(--rl-sub-text-color-rgb), 0.74);
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
          border-right: none;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
    }
  }
}
::v-deep .v-tabs-items {
  overflow: auto;
}
.golden-label {
  color: #938247;
}
.font-bold {
  font-weight: bold;
}
.v-btn--icon {
  height: 30px;
}
::v-deep .b-input .v-input .v-input__slot input[readonly='readonly'],
::v-deep .b-input .v-input .v-input__slot input[disabled='disabled'],
::v-deep .b-select .v-input .v-input__slot input[readonly='readonly'],
::v-deep .b-select .v-input .v-input__slot input[disabled='disabled'],
::v-deep .b-textarea .v-input .v-input__slot input[readonly='readonly'],
::v-deep .b-textarea .v-input .v-input__slot input[disabled='disabled'],
::v-deep .b-textarea textarea[readonly='readonly'],
::v-deep .b-textarea textarea[disabled='disabled'] {
  opacity: 0.9;
}
// ::v-deep .v-dialog {
//   height: 90%;
// }

.overflow-visible {
  overflow: visible !important;
}

.todo-list-heading {
  display: block;
  font-size: 24px;
  font-weight: 700;
}

.border-box {
  padding: 5px;
  border: 1px solid black;
}

.todo {
  width: 90%;
  height: 100%;
  display: flex;
  border: 1px solid black;
  border-radius: 20px;
  flex-direction: column;
}

.flex-row-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-column-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.width-50 {
  height: 100%;
  width: 50%;

  padding: 20px;
}
.width-70 {
  height: 100%;
  width: 69%;
  padding: 10px 10px 20px 20px;
}
.todo-description-box {
  height: 100%;
  width: 100%;
  border: 1px solid black;
}

.gap-20 {
  column-gap: 20px;
}

.todo-meta-1 {
  width: 80%;
  height: 100%;
  gap: 40px;
}
.todo-meta-2 {
  width: 20%;
  height: 100%;
  gap: 20px;
}

.todo-meta-3 {
  width: 100%;
  height: 100%;
  gap: 20px;
}

.flex-row {
  width: 100%;
  display: flex;
  gap: 10px;
}
.flex-gap {
  gap: 3%;
}

.border {
  border: 1px solid black;
}

.text-12 {
  font-size: 12px;
}

.width-40 {
  width: 45%;
}
.min-height-120 {
  min-height: 120px;
}
.hover-click {
  cursor: pointer;
}
.text-align-justify {
  text-align: justify;
}
.text-align-center {
  text-align: center;
}
// start drag drop area
.drop-area {
  width: 300px;
  height: 300px;
  border: 2px dashed #aaa;
  text-align: center;
  padding: 20px;
  font-size: 18px;
  cursor: pointer;
}

.drop-area.drag-over {
  border-color: #333;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #ccc;
}
.width-max-content {
  width: max-content;
}

// end drag drop area
</style>
